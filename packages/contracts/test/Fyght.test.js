const Fyght = artifacts.require("Fyght");
const { BN, expectEvent, expectRevert } = require("./helpers");

const ALICES_FYGHTER_ID = new BN("0");
const BOBS_FYGHTER_ID = new BN("1");

contract("Fyght", (accounts) => {
  const [aliceAddress, bobAddress] = accounts;
  let fyght;

  beforeEach(async () => {
    fyght = await Fyght.new();
  });

  beforeEach(async () => {
    // given
    const fyghterName = "Bruce lee";
    const balanceBefore = await fyght.balanceOf(aliceAddress);
    expect(`${balanceBefore}`).to.be.equal("0");

    // when
    const tx = await fyght.create(fyghterName, { from: aliceAddress });

    // then
    const balanceAfter = await fyght.balanceOf(aliceAddress);
    expect(`${balanceAfter}`).to.be.equal("1");
    expectEvent(tx, "NewFyghter", {
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

  describe("calculateAttackerProbability", () => {
    it("should calculate the win probability", async () => {
      // given
      const alice = await fyght.fyghters(ALICES_FYGHTER_ID);
      const bob = await fyght.fyghters(BOBS_FYGHTER_ID);
      expect(`${alice.xp}`).to.equal("1");
      expect(`${bob.xp}`).to.equal("1");

      // when
      const probability = await fyght.calculateAttackerProbability(ALICES_FYGHTER_ID, BOBS_FYGHTER_ID);

      // then
      expect(`${probability}`).to.equal(`${new BN("50").mul(new BN(`${1e18}`))}`);
    });
  });

  describe("attack", () => {
    it("should do an attack", async () => {
      // given
      const alice = await fyght.fyghters(ALICES_FYGHTER_ID);
      const bob = await fyght.fyghters(BOBS_FYGHTER_ID);
      expect(`${alice.xp}`).to.equal("1");
      expect(`${bob.xp}`).to.equal("1");

      // when
      const tx = await fyght.attack(ALICES_FYGHTER_ID, BOBS_FYGHTER_ID, { from: aliceAddress });

      // then
      const [attackEvent] = tx.receipt.logs.filter(({ event }) => event === "Attack");
      const {
        args: { winnerId },
      } = attackEvent;
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

    it("should change the skin", async () => {
      // given
      const minXpNeeded = 80;
      for (let i = 0; i < minXpNeeded * 2; ++i) {
        // eslint-disable-next-line no-await-in-loop
        await fyght.attack(ALICES_FYGHTER_ID, BOBS_FYGHTER_ID, { from: aliceAddress });
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
