const Fyght = artifacts.require("Fyght");
const FyghtTestUtils = require("./utils/FyghtTestUtils.js");
const { BN, expectEvent, expectRevert } = require("./helpers");

const ALICES_FYGHTER_ID = new BN("0");
const BOBS_FYGHTER_ID = new BN("1");

contract("Fyght", (accounts) => {
  const [aliceAddress, bobAddress, carlAddress] = accounts;
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
    const tx = await fyght.createFighter(fyghterName, { from: aliceAddress });

    // then
    const balanceAfter = await fyght.balanceOf(aliceAddress);
    expect(`${balanceAfter}`).to.be.equal("1");
    expectEvent(tx, "NewFighter", {
      id: ALICES_FYGHTER_ID,
      name: fyghterName,
    });

    await fyght.createFighter("Chuck", { from: bobAddress });
  });

  describe("createFighter", () => {
    it("shouldn't have more than one fyghter", async () => {
      // when
      const tx = fyght.createFighter("Second fyghter", { from: aliceAddress });

      // then
      await expectRevert(tx, "Each user can have just one fyghter.");
    });
  });

  describe("renameFighter", () => {
    it("should change skin", async () => {
      // given
      const newName = "Charlie";

      // when
      const tx = await fyght.renameFighter(ALICES_FYGHTER_ID, newName, { from: aliceAddress });

      // then
      const { name } = await fyght.fighters(ALICES_FYGHTER_ID);
      expect(name).to.equal(newName);
      expectEvent(tx, "FyghterRenamed", {
        id: ALICES_FYGHTER_ID,
        newName,
      });
    });

    it("shouldn't change sking if isn't the owner", async () => {
      // when
      const tx = fyght.renameFighter(ALICES_FYGHTER_ID, "Never", { from: bobAddress });

      // then
      await expectRevert(tx, "This operaction only can be done by the owner.");
    });
  });

  describe("calculateAttackerProbability", () => {
    it("should calculate the win probability", async () => {
      // given
      const alice = await fyght.fighters(ALICES_FYGHTER_ID);
      const bob = await fyght.fighters(BOBS_FYGHTER_ID);
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
      const alice = await fyght.fighters(ALICES_FYGHTER_ID);
      const bob = await fyght.fighters(BOBS_FYGHTER_ID);
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
      const winner = await fyght.fighters(winnerId);
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

    it.only("should change skin", async () => {
      // given
      const minXpNeeded = 10;
      for (let i = 0; i < minXpNeeded * 2; ++i) {
        // eslint-disable-next-line no-await-in-loop
        await fyght.attack(ALICES_FYGHTER_ID, BOBS_FYGHTER_ID, { from: aliceAddress });
      }

      const alice = await fyght.fighters(ALICES_FYGHTER_ID);
      const bob = await fyght.fighters(BOBS_FYGHTER_ID);
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
    });

    it("shouldn't change sking if isn't the owner", async () => {});
  });

  it.skip("fresh new fighter should have correct attributes", async () => {
    const fighterIds = await fyght.balanceOf(aliceAddress);
    const fighter = FyghtTestUtils.fighterToObject(await fyght.fighters(fighterIds[0]));

    assert.equal(fighter.name, "Bruce lee", "name != Bruce lee");
    assert.equal(fighter.skin, "naked", "skin != naked");
  });

  it.skip("rename character should works", async () => {
    const fighterIds = await fyght.balanceOf(aliceAddress);
    const fighterId = fighterIds[0];
    let fighter = FyghtTestUtils.fighterToObject(await fyght.fighters(fighterId));

    assert.equal(fighter.name, "Bruce lee", "name != Bruce lee");

    await fyght.renameFighter(fighterId, "Jackie Chan", { from: aliceAddress });

    fighter = FyghtTestUtils.fighterToObject(await fyght.fighters(fighterId));
    assert.equal(fighter.name, "Jackie Chan", "name != Jackie Chan");
  });

  it.skip("after fight winner and losses counter should be upgrated and winner should gains xp", async () => {
    await fyght.createFighter("Chuck Norris", { from: bobAddress });

    const aliceFighterId = (await fyght.balanceOf(aliceAddress))[0];
    const bobFighterId = (await fyght.balanceOf(bobAddress))[0];

    // let p = await fyght.calculateAttackerProbability(aliceFighterId, bobFighterId);

    const aliceFighterBefore = FyghtTestUtils.fighterToObject(await fyght.fighters(aliceFighterId));
    const bobFighterBefore = FyghtTestUtils.fighterToObject(await fyght.fighters(bobFighterId));

    const receipt = await fyght.attack(bobFighterId, aliceFighterId, { from: bobAddress });
    const winnerId = receipt.logs[0].args.winnerId.toNumber();
    // let winnerId = receipt.logs[receipt.logs.length-1].args.winnerId.toNumber();

    const aliceFighterAfter = FyghtTestUtils.fighterToObject(await fyght.fighters(aliceFighterId));
    const bobFighterAfter = FyghtTestUtils.fighterToObject(await fyght.fighters(bobFighterId));

    assert.isTrue(winnerId === aliceFighterId || winnerId === bobFighterId, "invalid winner");

    const winnerBefore = winnerId === aliceFighterId ? aliceFighterBefore : bobFighterBefore;
    const winnerAfter = winnerId === aliceFighterId ? aliceFighterAfter : bobFighterAfter;

    const loserBefore = winnerId === aliceFighterId ? bobFighterBefore : aliceFighterBefore;
    const loserAfter = winnerId === aliceFighterId ? bobFighterAfter : aliceFighterAfter;

    assert.isTrue(winnerBefore.winCount < winnerAfter.winCount, "winner's winCount don't incresed");
    assert.isTrue(winnerBefore.lossCount === winnerAfter.lossCount, "winner's lossCount incresed ");
    assert.isTrue(winnerBefore.xp < winnerAfter.xp, "winner's xp not changed");

    assert.isTrue(loserBefore.winCount === loserAfter.winCount, "loser's winCount changed ");
    assert.isTrue(loserBefore.lossCount < loserAfter.lossCount, "loser's lossCount not changed ");
    assert.isTrue(loserBefore.xp === loserAfter.xp, "loser's xp changed ");
  });

  it.skip("skins should changed correctly", async function() {
    const aliceFighterId = (await fyght.balanceOf(aliceAddress))[0];
    const bobFighterId = (await fyght.balanceOf(bobAddress))[0];
    const { fighterOwnership } = this;

    let attacks = [];
    for (let i = 0; i < 10; ++i) {
      attacks.push(fyght.attack(aliceFighterId, bobFighterId, { from: aliceAddress }));
      attacks.push(fyght.attack(bobFighterId, aliceFighterId, { from: bobAddress }));
    }

    Promise.all(attacks).then(async () => {
      const aliceFighter = FyghtTestUtils.fighterToObject(await fighterOwnership.fighters(aliceFighterId));
      const alicePossibleSkins = FyghtTestUtils.getPossibleSkins(aliceFighter.xp, aliceFighter.qi);
      assert.isTrue(
        alicePossibleSkins.indexOf(aliceFighter.skin) > -1,
        `Alice's skin (${aliceFighter.skin}) invalid, should be one of: ${alicePossibleSkins}`,
      );

      const bobFighter = FyghtTestUtils.fighterToObject(await fighterOwnership.fighters(bobFighterId));
      const bobPossibleSkins = FyghtTestUtils.getPossibleSkins(bobFighter.xp, bobFighter.qi);
      assert.isTrue(
        bobPossibleSkins.indexOf(bobFighter.skin) > -1,
        `Bob's skin (${bobFighter.skin}) invalid, should be one of: ${bobPossibleSkins}`,
      );
    });

    attacks = [];
    for (let i = 0; i < 100; ++i) {
      attacks.push(fyght.attack(aliceFighterId, bobFighterId, { from: aliceAddress }));
      attacks.push(fyght.attack(bobFighterId, aliceFighterId, { from: bobAddress }));
    }

    Promise.all(attacks).then(async () => {
      const aliceFighter = FyghtTestUtils.fighterToObject(await fighterOwnership.fighters(aliceFighterId));
      const alicePossibleSkins = FyghtTestUtils.getPossibleSkins(aliceFighter.xp, aliceFighter.qi);
      assert.isTrue(
        alicePossibleSkins.indexOf(aliceFighter.skin) > -1,
        `Alice's skin (${aliceFighter.skin}) invalid, should be one of: ${alicePossibleSkins}`,
      );

      const bobFighter = FyghtTestUtils.fighterToObject(await fighterOwnership.fighters(bobFighterId));
      const bobPossibleSkins = FyghtTestUtils.getPossibleSkins(bobFighter.xp, bobFighter.qi);
      assert.isTrue(
        bobPossibleSkins.indexOf(bobFighter.skin) > -1,
        `Bob's skin (${bobFighter.skin}) invalid, should be one of: ${bobPossibleSkins}`,
      );

      // console.log(aliceFighter)
      // console.log(bobFighter)
    });
  });

  it.skip("skin changed should works", async () => {
    await fyght.createFighter("Mr. Miyagi", { from: carlAddress });
    // const carlFighterId = (await fyght.balanceOf(carl))[0];
    // const carlFighter = FyghtTestUtils.fighterToObject(await fyght.fighters(carlFighterId));

    const aliceFighterId = (await fyght.balanceOf(aliceAddress))[0];
    const bobFighterId = (await fyght.balanceOf(bobAddress))[0];

    const aliceFighter = FyghtTestUtils.fighterToObject(await fyght.fighters(aliceFighterId));
    const bobFighter = FyghtTestUtils.fighterToObject(await fyght.fighters(bobFighterId));

    if (aliceFighter.xp >= 80) {
      await fyght.changeSkin(aliceFighterId, "naked", { from: aliceAddress });
    } else if (bobFighter.xp >= 80) {
      await fyght.changeSkin(bobFighterId, "naked", { from: bobAddress });
    } else {
      assert.fail("one of fighters must have xp >= 80");
    }
  });
});
