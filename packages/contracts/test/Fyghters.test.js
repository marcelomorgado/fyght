// TODO: Setup chain + BN
const FyghtersMock = artifacts.require("mocks/FyghtersMock");
const Dai = artifacts.require("Dai");
const { BN, expectEvent, expectRevert } = require("./helpers");

const ALICE_FYGHTER_ID = new BN("0");
const BOB_FYGHTER_ID = new BN("1");

const ONE = new BN(`${1e18}`);

// TODO: Move to .env file
const APPROVAL_AMOUNT = new BN("100").mul(ONE);
const MIN_DEPOSIT = new BN("5").mul(ONE);
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
    const { name, balance } = await fyghtersMock.fyghters(ALICE_FYGHTER_ID);
    expect(name).to.equal(fyghterName);
    expect(`${balance}`).to.equal(`${MIN_DEPOSIT}`);

    const balanceAfter = await fyghtersMock.balanceOf(aliceAddress);
    expect(`${balanceAfter}`).to.be.equal("1");
    expectEvent(tx, "FyghterCreated", {
      owner: aliceAddress,
      id: ALICE_FYGHTER_ID,
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
      const tx = await fyghtersMock.rename(ALICE_FYGHTER_ID, newName, { from: aliceAddress });

      // then
      const { name } = await fyghtersMock.fyghters(ALICE_FYGHTER_ID);
      expect(name).to.equal(newName);
      expectEvent(tx, "FyghterRenamed", {
        id: ALICE_FYGHTER_ID,
        newName,
      });
    });

    it("shouldn't change sking if isn't the owner", async () => {
      // when
      const tx = fyghtersMock.rename(ALICE_FYGHTER_ID, "Never", { from: bobAddress });

      // then
      await expectRevert(tx, "This operaction only can be done by the owner.");
    });
  });

  describe("calculateChallengerProbability", () => {
    it("should calculate the win probability", async () => {
      // given
      const alice = await fyghtersMock.fyghters(ALICE_FYGHTER_ID);
      const bob = await fyghtersMock.fyghters(BOB_FYGHTER_ID);
      expect(`${alice.xp}`).to.equal("1");
      expect(`${bob.xp}`).to.equal("1");

      // when
      const probability = await fyghtersMock.calculateChallengerProbability(ALICE_FYGHTER_ID, BOB_FYGHTER_ID);

      // then
      expect(`${probability}`).to.equal(`${new BN("50").mul(new BN(`${1e16}`))}`);
    });
  });

  describe("challenge", () => {
    const expectChallenge = async ({
      challengerId,
      challengerAddress,
      targetId,
      winnerId,
      winProbability,
      expectedPrize,
    }) => {
      // given
      const { xp: challengerXpBefore, balance: challengerBalanceBefore } = await fyghtersMock.fyghters(winnerId);
      const { xp: targetXpBefore, balance: targetBalanceBefore } = await fyghtersMock.fyghters(targetId);
      expect(`${challengerBalanceBefore}`).to.equal(`${MIN_DEPOSIT}`);
      expect(`${targetBalanceBefore}`).to.equal(`${MIN_DEPOSIT}`);

      // when
      await fyghtersMock.deterministicChallenge(challengerId, targetId, winnerId, winProbability, {
        from: challengerAddress,
      });

      // then
      const { xp: challengerXpAfter, balance: challengerBalanceAfter } = await fyghtersMock.fyghters(winnerId);
      const { xp: targetXpAfter, balance: loserBalanceAfter } = await fyghtersMock.fyghters(targetId);

      expect(`${challengerXpAfter}`).to.equal(`${challengerXpBefore.add(new BN("1"))}`);
      expect(`${targetXpAfter}`).to.equal(`${targetXpBefore}`);
      expect(`${challengerBalanceAfter}`).to.equal(`${challengerBalanceBefore.add(expectedPrize)}`);
      expect(`${loserBalanceAfter}`).to.equal(`${targetBalanceBefore.sub(expectedPrize)}`);
    };

    it("should do a challenge (winning a 50% bet)", async () => {
      // given
      const challengerId = ALICE_FYGHTER_ID;
      const targetId = BOB_FYGHTER_ID;
      const challengerAddress = aliceAddress;
      const winnerId = challengerId;

      const winProbability = new BN("50").mul(new BN(`${1e16}`));
      const expectedPrize = new BN(BET_VALUE).div(new BN("2"));

      // when-then
      await expectChallenge({
        challengerId,
        challengerAddress,
        targetId,
        winnerId,
        winProbability,
        expectedPrize,
      });
    });

    it("should do a challenge (winning a 75% bet)", async () => {
      // given
      const challengerId = ALICE_FYGHTER_ID;
      const targetId = BOB_FYGHTER_ID;
      const challengerAddress = aliceAddress;
      const winnerId = challengerId;

      const winProbability = new BN("75").mul(new BN(`${1e16}`));
      const expectedPrize = new BN(BET_VALUE).div(new BN("4"));

      // when-then
      await expectChallenge({
        challengerId,
        challengerAddress,
        targetId,
        winnerId,
        winProbability,
        expectedPrize,
      });
    });

    it("should do a challenge (winning a 1% bet)", async () => {
      // given
      const challengerId = ALICE_FYGHTER_ID;
      const targetId = BOB_FYGHTER_ID;
      const challengerAddress = aliceAddress;
      const winnerId = challengerId;

      const winProbability = new BN("1").mul(new BN(`${1e16}`));
      const expectedPrize = new BN(BET_VALUE).mul(ONE.sub(winProbability)).div(ONE);

      // when-then
      await expectChallenge({
        challengerId,
        challengerAddress,
        targetId,
        winnerId,
        winProbability,
        expectedPrize,
      });
    });
  });

  describe("changeSkin", () => {
    it("shouldn't change skin if hasn't enough xp", async () => {
      // when
      const tx = fyghtersMock.changeSkin(ALICE_FYGHTER_ID, "normal_guy", { from: aliceAddress });

      // then
      await expectRevert(tx, "The fyghter has no enough XP to change skin.");
    });

    it("should change the skin", async () => {
      // given
      const fyghterId = ALICE_FYGHTER_ID;
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
      const fyghterId = ALICE_FYGHTER_ID;
      const newSkin = "normal_guy";

      // when
      const tx = fyghtersMock.changeSkin(fyghterId, newSkin, { from: bobAddress });

      // then
      await expectRevert(tx, "This operaction only can be done by the owner.");
    });
  });
});
