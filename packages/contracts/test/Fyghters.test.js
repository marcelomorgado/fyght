const Fyghters = artifacts.require("Fyghters");
const Dai = artifacts.require("Dai");
const { BN, expectEvent, expectRevert } = require("./helpers");

const ALICES_FYGHTER_ID = new BN("0");
const BOBS_FYGHTER_ID = new BN("1");

const APPROVAL_AMOUNT = `${100e18}`; // 100$

// TODO: Move to .env file
const MIN_DEPOSIT = `${5e18}`;
const BET_VALUE = `${5e18}`;

contract("Fyghters", ([aliceAddress, bobAddress, carlAddress]) => {
  let fyghters;
  let dai;

  beforeEach(async () => {
    dai = await Dai.new();
    fyghters = await Fyghters.new(dai.address);
    await dai.mint(APPROVAL_AMOUNT, { from: aliceAddress });
    await dai.approve(fyghters.address, APPROVAL_AMOUNT, { from: aliceAddress });
    await dai.mint(APPROVAL_AMOUNT, { from: bobAddress });
    await dai.approve(fyghters.address, APPROVAL_AMOUNT, { from: bobAddress });
  });

  beforeEach(async () => {
    // given
    const fyghterName = "Bruce lee";
    const balanceBefore = await fyghters.balanceOf(aliceAddress);
    expect(`${balanceBefore}`).to.be.equal("0");

    // when
    const tx = await fyghters.create(fyghterName, { from: aliceAddress });

    // then
    const { name, balance } = await fyghters.fyghters(ALICES_FYGHTER_ID);
    expect(name).to.equal(fyghterName);
    expect(`${balance}`).to.equal(MIN_DEPOSIT);

    const balanceAfter = await fyghters.balanceOf(aliceAddress);
    expect(`${balanceAfter}`).to.be.equal("1");
    expectEvent(tx, "FyghterCreated", {
      owner: aliceAddress,
      id: ALICES_FYGHTER_ID,
      name: fyghterName,
    });

    await fyghters.create("Chuck", { from: bobAddress });
  });

  describe("create", () => {
    it("shouldn't have more than one fyghter", async () => {
      // when
      const tx = fyghters.create("Second fyghter", { from: aliceAddress });

      // then
      await expectRevert(tx, "Each user can have just one fyghter.");
    });

    it("shouldn't be able to create fyghter without min allowance", async () => {
      // when
      const tx = fyghters.create("Bruce", { from: carlAddress });

      // then
      await expectRevert(tx, "Dai allowance is less than the minimum.");
    });
  });

  describe("rename", () => {
    it("should change skin", async () => {
      // given
      const newName = "Charlie";

      // when
      const tx = await fyghters.rename(ALICES_FYGHTER_ID, newName, { from: aliceAddress });

      // then
      const { name } = await fyghters.fyghters(ALICES_FYGHTER_ID);
      expect(name).to.equal(newName);
      expectEvent(tx, "FyghterRenamed", {
        id: ALICES_FYGHTER_ID,
        newName,
      });
    });

    it("shouldn't change sking if isn't the owner", async () => {
      // when
      const tx = fyghters.rename(ALICES_FYGHTER_ID, "Never", { from: bobAddress });

      // then
      await expectRevert(tx, "This operaction only can be done by the owner.");
    });
  });

  describe("calculateChallengerProbability", () => {
    it("should calculate the win probability", async () => {
      // given
      const alice = await fyghters.fyghters(ALICES_FYGHTER_ID);
      const bob = await fyghters.fyghters(BOBS_FYGHTER_ID);
      expect(`${alice.xp}`).to.equal("1");
      expect(`${bob.xp}`).to.equal("1");

      // when
      const probability = await fyghters.calculateChallengerProbability(ALICES_FYGHTER_ID, BOBS_FYGHTER_ID);

      // then
      expect(`${probability}`).to.equal(`${new BN("50").mul(new BN(`${1e18}`))}`);
    });
  });

  // TODO: Non winner determinism
  describe.only("challenge", () => {
    it("should do a challenge", async () => {
      // given
      const winnerId = ALICES_FYGHTER_ID;
      const loserId = BOBS_FYGHTER_ID;
      const initialXp = "1";
      const winnerAddress = aliceAddress;

      const { xp: winnerXpBefore, balance: winnerBalanceBefore } = await fyghters.fyghters(winnerId);
      const { xp: loserXpBefore, balance: loserBalanceBefore } = await fyghters.fyghters(loserId);
      expect(`${winnerXpBefore}`).to.equal(initialXp);
      expect(`${loserXpBefore}`).to.equal(initialXp);
      expect(`${winnerBalanceBefore}`).to.equal(MIN_DEPOSIT);
      expect(`${loserBalanceBefore}`).to.equal(MIN_DEPOSIT);

      // when
      await fyghters.challenge(winnerId, loserId, { from: winnerAddress });

      // then

      const { xp: winnerXpAfter, balance: winnerBalanceAfter } = await fyghters.fyghters(winnerId);
      const { xp: loserXpAfter, balance: loserBalanceAfter } = await fyghters.fyghters(loserId);

      expect(`${winnerXpAfter}`).to.equal("2");
      expect(`${loserXpAfter}`).to.equal(`${loserXpBefore}`);
      expect(`${loserBalanceAfter}`).to.equal(`${loserBalanceBefore.sub(new BN(BET_VALUE))}`);
      expect(`${winnerBalanceAfter}`).to.equal(`${winnerBalanceBefore.add(new BN(BET_VALUE))}`);
    });
  });

  describe("changeSkin", () => {
    it("shouldn't change skin if hasn't enough xp", async () => {
      // when
      const tx = fyghters.changeSkin(ALICES_FYGHTER_ID, "normal_guy", { from: aliceAddress });

      // then
      await expectRevert(tx, "The fyghter has no enough XP to change skin.");
    });

    // TODO: This test case is slow, to create a mock contract that will allow changing a fyghter xp
    it("should change the skin", async () => {
      // given
      const minXpNeeded = 80;
      for (let i = 0; i < minXpNeeded * 2; ++i) {
        // eslint-disable-next-line no-await-in-loop
        await fyghters.challenge(ALICES_FYGHTER_ID, BOBS_FYGHTER_ID, { from: aliceAddress });
      }

      const alice = await fyghters.fyghters(ALICES_FYGHTER_ID);
      const bob = await fyghters.fyghters(BOBS_FYGHTER_ID);
      const better = alice.xp.gt(bob.xp)
        ? { fyghter: alice, owner: aliceAddress }
        : { fyghter: bob, owner: bobAddress };
      expect(better.fyghter.xp.gte(new BN(`${minXpNeeded}`))).to.be.true;
      const newSkin = "normal_guy";

      // when
      const tx = await fyghters.changeSkin(better.fyghter.id, newSkin, { from: better.owner });
      expectEvent(tx, "SkinChanged", {
        id: better.fyghter.id,
        newSkin,
      });

      const { skin } = await fyghters.fyghters(better.fyghter.id);
      expect(skin).to.equal(newSkin);
    });

    it("shouldn't change sking if isn't the owner", async () => {});
  });
});
