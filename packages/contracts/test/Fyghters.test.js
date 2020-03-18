const Fyghters = artifacts.require("Fyghters");
const Dai = artifacts.require("Dai");
const { BN, expectEvent, expectRevert } = require("./helpers");

const ALICES_FYGHTER_ID = new BN("0");
const BOBS_FYGHTER_ID = new BN("1");

const APPROVAL_VALUE = `${100e18}`; // 100$

// TODO: Move to .env file
const MIN_DEPOSIT = `${5e18}`; // 5$

contract("Fyghters", ([aliceAddress, bobAddress, carlAddress]) => {
  let fyght;
  let dai;

  beforeEach(async () => {
    dai = await Dai.new();
    fyght = await Fyghters.new(dai.address);
    await dai.approve(fyght.address, APPROVAL_VALUE, { from: aliceAddress });
    await dai.approve(fyght.address, APPROVAL_VALUE, { from: bobAddress });
  });

  beforeEach(async () => {
    // given
    const fyghterName = "Bruce lee";
    const balanceBefore = await fyght.balanceOf(aliceAddress);
    expect(`${balanceBefore}`).to.be.equal("0");

    // when
    const tx = await fyght.create(fyghterName, { from: aliceAddress });

    // then
    const { name, balance } = await fyght.fyghters(ALICES_FYGHTER_ID);
    expect(name).to.equal(fyghterName);
    expect(`${balance}`).to.equal(MIN_DEPOSIT);

    const balanceAfter = await fyght.balanceOf(aliceAddress);
    expect(`${balanceAfter}`).to.be.equal("1");
    expectEvent(tx, "FyghterCreated", {
      owner: aliceAddress,
      id: ALICES_FYGHTER_ID,
      name: fyghterName,
    });

    await fyght.create("Chuck", { from: bobAddress });
  });

  describe("create", () => {
    it("shouldn't have more than one fyghter", async () => {
      // when
      const tx = fyght.create("Second fyghter", { from: aliceAddress });

      // then
      await expectRevert(tx, "Each user can have just one fyghter.");
    });

    it("shouldn't be able to create fyghter without min allowance", async () => {
      // when
      const tx = fyght.create("Bruce", { from: carlAddress });

      // then
      await expectRevert(tx, "Dai allowance is less than the minimum.");
    });
  });

  describe("rename", () => {
    it("should change skin", async () => {
      // given
      const newName = "Charlie";

      // when
      const tx = await fyght.rename(ALICES_FYGHTER_ID, newName, { from: aliceAddress });

      // then
      const { name } = await fyght.fyghters(ALICES_FYGHTER_ID);
      expect(name).to.equal(newName);
      expectEvent(tx, "FyghterRenamed", {
        id: ALICES_FYGHTER_ID,
        newName,
      });
    });

    it("shouldn't change sking if isn't the owner", async () => {
      // when
      const tx = fyght.rename(ALICES_FYGHTER_ID, "Never", { from: bobAddress });

      // then
      await expectRevert(tx, "This operaction only can be done by the owner.");
    });
  });

  describe("calculateChallengerProbability", () => {
    it("should calculate the win probability", async () => {
      // given
      const alice = await fyght.fyghters(ALICES_FYGHTER_ID);
      const bob = await fyght.fyghters(BOBS_FYGHTER_ID);
      expect(`${alice.xp}`).to.equal("1");
      expect(`${bob.xp}`).to.equal("1");

      // when
      const probability = await fyght.calculateChallengerProbability(ALICES_FYGHTER_ID, BOBS_FYGHTER_ID);

      // then
      expect(`${probability}`).to.equal(`${new BN("50").mul(new BN(`${1e18}`))}`);
    });
  });

  describe("challenge", () => {
    it("should do a challenge", async () => {
      // given
      const alice = await fyght.fyghters(ALICES_FYGHTER_ID);
      const bob = await fyght.fyghters(BOBS_FYGHTER_ID);
      expect(`${alice.xp}`).to.equal("1");
      expect(`${bob.xp}`).to.equal("1");

      // when
      const tx = await fyght.challenge(ALICES_FYGHTER_ID, BOBS_FYGHTER_ID, { from: aliceAddress });

      // then
      const [challengeEvent] = tx.receipt.logs.filter(({ event }) => event === "ChallengeOccurred");
      const {
        args: { winnerId },
      } = challengeEvent;
      expect([`${ALICES_FYGHTER_ID}`, `${BOBS_FYGHTER_ID}`]).to.include(`${winnerId}`);
      const winner = await fyght.fyghters(winnerId);
      expect(`${winner.xp}`).to.equal("2");
    });
  });

  describe("changeSkin", () => {
    it("shouldn't change skin if hasn't enough xp", async () => {
      // when
      const tx = fyght.changeSkin(ALICES_FYGHTER_ID, "normal_guy", { from: aliceAddress });

      // then
      await expectRevert(tx, "The fyghter has no enough XP to change skin.");
    });

    // TODO: This test case is slow, to create a mock contract that will allow changing a fyghter xp
    it("should change the skin", async () => {
      // given
      const minXpNeeded = 80;
      for (let i = 0; i < minXpNeeded * 2; ++i) {
        // eslint-disable-next-line no-await-in-loop
        await fyght.challenge(ALICES_FYGHTER_ID, BOBS_FYGHTER_ID, { from: aliceAddress });
      }

      const alice = await fyght.fyghters(ALICES_FYGHTER_ID);
      const bob = await fyght.fyghters(BOBS_FYGHTER_ID);
      const better = alice.xp.gt(bob.xp)
        ? { fyghter: alice, owner: aliceAddress }
        : { fyghter: bob, owner: bobAddress };
      expect(better.fyghter.xp.gte(new BN(`${minXpNeeded}`))).to.be.true;
      const newSkin = "normal_guy";

      // when
      const tx = await fyght.changeSkin(better.fyghter.id, newSkin, { from: better.owner });
      expectEvent(tx, "SkinChanged", {
        id: better.fyghter.id,
        newSkin,
      });

      const { skin } = await fyght.fyghters(better.fyghter.id);
      expect(skin).to.equal(newSkin);
    });

    it("shouldn't change sking if isn't the owner", async () => {});
  });
});
