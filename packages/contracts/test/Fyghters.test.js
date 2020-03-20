const FyghtersMock = artifacts.require("mocks/FyghtersMock");
const Dai = artifacts.require("Dai");
const { BN, expectEvent, expectRevert } = require("./helpers");

const ALICES_FYGHTER_ID = new BN("0");
const BOBS_FYGHTER_ID = new BN("1");

const ONE_ETHER = new BN(`${1e18}`);

// TODO: Move to .env file
const APPROVAL_AMOUNT = new BN("100").mul(ONE_ETHER);
const MIN_DEPOSIT = new BN("5").mul(ONE_ETHER);
const BET_VALUE = MIN_DEPOSIT;

contract("Fyghters", ([aliceAddress, bobAddress, carlAddress]) => {
  let fyghtersMock;
  let dai;

  beforeEach(async () => {
    dai = await Dai.new();
    fyghtersMock = await FyghtersMock.new(dai.address);
    await dai.mint(APPROVAL_AMOUNT, { from: aliceAddress });
    await dai.approve(fyghtersMock.address, APPROVAL_AMOUNT, { from: aliceAddress });
    await dai.mint(APPROVAL_AMOUNT, { from: bobAddress });
    await dai.approve(fyghtersMock.address, APPROVAL_AMOUNT, { from: bobAddress });
  });

  beforeEach(async () => {
    // given
    const fyghterName = "Bruce lee";
    const balanceBefore = await fyghtersMock.balanceOf(aliceAddress);
    expect(`${balanceBefore}`).to.be.equal("0");

    // when
    const tx = await fyghtersMock.create(fyghterName, { from: aliceAddress });

    // then
    const { name, balance } = await fyghtersMock.fyghters(ALICES_FYGHTER_ID);
    expect(name).to.equal(fyghterName);
    expect(`${balance}`).to.equal(`${MIN_DEPOSIT}`);

    const balanceAfter = await fyghtersMock.balanceOf(aliceAddress);
    expect(`${balanceAfter}`).to.be.equal("1");
    expectEvent(tx, "FyghterCreated", {
      owner: aliceAddress,
      id: ALICES_FYGHTER_ID,
      name: fyghterName,
    });

    await fyghtersMock.create("Chuck", { from: bobAddress });
  });

  describe("create", () => {
    it("shouldn't have more than one fyghter", async () => {
      // when
      const tx = fyghtersMock.create("Second fyghter", { from: aliceAddress });

      // then
      await expectRevert(tx, "Each user can have just one fyghter.");
    });

    it("shouldn't be able to create fyghter without min allowance", async () => {
      // when
      const tx = fyghtersMock.create("Bruce", { from: carlAddress });

      // then
      await expectRevert(tx, "Dai allowance is less than the minimum.");
    });
  });

  describe("rename", () => {
    it("should change skin", async () => {
      // given
      const newName = "Charlie";

      // when
      const tx = await fyghtersMock.rename(ALICES_FYGHTER_ID, newName, { from: aliceAddress });

      // then
      const { name } = await fyghtersMock.fyghters(ALICES_FYGHTER_ID);
      expect(name).to.equal(newName);
      expectEvent(tx, "FyghterRenamed", {
        id: ALICES_FYGHTER_ID,
        newName,
      });
    });

    it("shouldn't change sking if isn't the owner", async () => {
      // when
      const tx = fyghtersMock.rename(ALICES_FYGHTER_ID, "Never", { from: bobAddress });

      // then
      await expectRevert(tx, "This operaction only can be done by the owner.");
    });
  });

  describe("calculateChallengerProbability", () => {
    it("should calculate the win probability", async () => {
      // given
      const alice = await fyghtersMock.fyghters(ALICES_FYGHTER_ID);
      const bob = await fyghtersMock.fyghters(BOBS_FYGHTER_ID);
      expect(`${alice.xp}`).to.equal("1");
      expect(`${bob.xp}`).to.equal("1");

      // when
      const probability = await fyghtersMock.calculateChallengerProbability(ALICES_FYGHTER_ID, BOBS_FYGHTER_ID);

      // then
      expect(`${probability}`).to.equal(`${new BN("50").mul(new BN(`${1e16}`))}`);
    });
  });

  describe("challenge", () => {
    it("should do a challenge", async () => {
      // given
      const winnerId = ALICES_FYGHTER_ID;
      const loserId = BOBS_FYGHTER_ID;
      const initialXp = "1";
      const winnerAddress = aliceAddress;

      const { xp: winnerXpBefore, balance: winnerBalanceBefore } = await fyghtersMock.fyghters(winnerId);
      const { xp: loserXpBefore, balance: loserBalanceBefore } = await fyghtersMock.fyghters(loserId);
      expect(`${winnerXpBefore}`).to.equal(initialXp);
      expect(`${loserXpBefore}`).to.equal(initialXp);
      expect(`${winnerBalanceBefore}`).to.equal(`${MIN_DEPOSIT}`);
      expect(`${loserBalanceBefore}`).to.equal(`${MIN_DEPOSIT}`);

      const winProbability = new BN("50").mul(new BN(`${1e16}`));

      // when
      await fyghtersMock.deterministicChallenge(winnerId, loserId, winnerId, winProbability, { from: winnerAddress });

      // then
      const pot = new BN(BET_VALUE).mul(new BN(2));
      const prize = pot.sub(pot.mul(winProbability).div(ONE_ETHER));

      const { xp: winnerXpAfter, balance: winnerBalanceAfter } = await fyghtersMock.fyghters(winnerId);
      const { xp: loserXpAfter, balance: loserBalanceAfter } = await fyghtersMock.fyghters(loserId);

      expect(`${winnerXpAfter}`).to.equal("2");
      expect(`${loserXpAfter}`).to.equal(`${loserXpBefore}`);
      expect(`${winnerBalanceAfter}`).to.equal(`${winnerBalanceBefore.add(prize)}`);
      expect(`${loserBalanceAfter}`).to.equal(`${loserBalanceBefore.sub(prize)}`);
    });
  });

  describe("changeSkin", () => {
    it("shouldn't change skin if hasn't enough xp", async () => {
      // when
      const tx = fyghtersMock.changeSkin(ALICES_FYGHTER_ID, "normal_guy", { from: aliceAddress });

      // then
      await expectRevert(tx, "The fyghter has no enough XP to change skin.");
    });

    it("should change the skin", async () => {
      // given
      const fyghterId = ALICES_FYGHTER_ID;
      const fyghterAddress = aliceAddress;
      const minXpNeeded = 80;
      const newSkin = "normal_guy";

      await fyghtersMock.changeFyghterXp(fyghterId, `${new BN(`${minXpNeeded}`)}`, { from: aliceAddress });

      // when
      const tx = await fyghtersMock.changeSkin(fyghterId, newSkin, { from: fyghterAddress });

      // then
      expectEvent(tx, "SkinChanged", {
        id: fyghterId,
        newSkin,
      });

      const { skin } = await fyghtersMock.fyghters(fyghterId);
      expect(skin).to.equal(newSkin);
    });

    it("shouldn't change sking if isn't the owner", async () => {
      // given
      const fyghterId = ALICES_FYGHTER_ID;
      const newSkin = "normal_guy";

      // when
      const tx = fyghtersMock.changeSkin(fyghterId, newSkin, { from: bobAddress });

      // then
      await expectRevert(tx, "This operaction only can be done by the owner.");
    });
  });
});
