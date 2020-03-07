const Fyght = artifacts.require("Fyght");
const FyghtTestUtils = require("./utils/FyghtTestUtils.js");
const { BN, expectEvent, expectRevert } = require("./helpers");

const ALICES_FYGHTER_ID = new BN("0");
const BOBS_FYGHTER_ID = new BN("1");

contract("Fyght", (accounts) => {
  const [alice, bob, carl] = accounts;
  let fyght;

  beforeEach(async () => {
    fyght = await Fyght.new();
  });

  beforeEach(async () => {
    // given
    const fyghterName = "Bruce lee";
    const balanceBefore = await fyght.balanceOf(alice);
    expect(`${balanceBefore}`).to.be.equal("0");

    // when
    const tx = await fyght.createFighter(fyghterName, { from: alice });

    // then
    const balanceAfter = await fyght.balanceOf(alice);
    expect(`${balanceAfter}`).to.be.equal("1");
    expectEvent(tx, "NewFighter", {
      id: ALICES_FYGHTER_ID,
      name: fyghterName,
    });

    await fyght.createFighter("Chuck", { from: bob });
  });

  describe("createFighter", () => {
    it("shouldn't have more than one fyghter", async () => {
      // when
      const tx = fyght.createFighter("Second fyghter", { from: alice });

      // then
      await expectRevert(tx, "Each user can have just one fyghter.");
    });
  });

  describe("renameFighter", () => {
    it("should change skin", async () => {
      // given
      const newName = "Charlie";

      // when
      const tx = await fyght.renameFighter(ALICES_FYGHTER_ID, newName, { from: alice });

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
      const tx = fyght.renameFighter(ALICES_FYGHTER_ID, "Never", { from: bob });

      // then
      await expectRevert(tx, "This operaction only can be done by the owner.");
    });
  });

  describe.only("calculateAttackerProbability", () => {
    it("should calculate the win probability", async () => {
      // given
      const aliceFyghter = await fyght.fighters(ALICES_FYGHTER_ID);
      const bobFyghter = await fyght.fighters(BOBS_FYGHTER_ID);
      expect(`${aliceFyghter.xp}`).to.equal("1");
      expect(`${bobFyghter.xp}`).to.equal("1");

      // when
      const prob = await fyght.calculateAttackerProbability(ALICES_FYGHTER_ID, BOBS_FYGHTER_ID);

      // then
      expect(`${prob}`).to.equal(`${new BN("50").mul(new BN(`${1e18}`))}`);
    });
  });

  describe.skip("changeSkin", () => {
    it("shouldn't change skin if hasn't enough xp", async () => {
      // when
      const tx = fyght.changeSkin(ALICES_FYGHTER_ID, "normal_guy", { from: alice });

      // then
      await expectRevert(tx, "The fyghter has no enough XP to change skin.");
    });

    it("should change skin", async () => {
      // given
      const tx = await fyght.createFighter("Chuck", { from: bob });
      console.log(tx);

      for (let i = 0; i < 200; ++i) {
        // TODO: Attack
      }
    });

    it("shouldn't change sking if isn't the owner", async () => {});
  });

  it("fresh new fighter should have correct attributes", async () => {
    const fighterIds = await fyght.balanceOf(alice);
    const fighter = FyghtTestUtils.fighterToObject(await fyght.fighters(fighterIds[0]));

    assert.equal(fighter.name, "Bruce lee", "name != Bruce lee");
    assert.equal(fighter.skin, "naked", "skin != naked");
  });

  it("rename character should works", async () => {
    const fighterIds = await fyght.balanceOf(alice);
    const fighterId = fighterIds[0];
    let fighter = FyghtTestUtils.fighterToObject(await fyght.fighters(fighterId));

    assert.equal(fighter.name, "Bruce lee", "name != Bruce lee");

    await fyght.renameFighter(fighterId, "Jackie Chan", { from: alice });

    fighter = FyghtTestUtils.fighterToObject(await fyght.fighters(fighterId));
    assert.equal(fighter.name, "Jackie Chan", "name != Jackie Chan");
  });

  it.skip("after fight winner and losses counter should be upgrated and winner should gains xp", async () => {
    await fyght.createFighter("Chuck Norris", { from: bob });

    const aliceFighterId = (await fyght.balanceOf(alice))[0];
    const bobFighterId = (await fyght.balanceOf(bob))[0];

    // let p = await fyght.calculateAttackerProbability(aliceFighterId, bobFighterId);

    const aliceFighterBefore = FyghtTestUtils.fighterToObject(await fyght.fighters(aliceFighterId));
    const bobFighterBefore = FyghtTestUtils.fighterToObject(await fyght.fighters(bobFighterId));

    const receipt = await fyght.attack(bobFighterId, aliceFighterId, { from: bob });
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
    const aliceFighterId = (await fyght.balanceOf(alice))[0];
    const bobFighterId = (await fyght.balanceOf(bob))[0];
    const { fighterOwnership } = this;

    let attacks = [];
    for (let i = 0; i < 10; ++i) {
      attacks.push(fyght.attack(aliceFighterId, bobFighterId, { from: alice }));
      attacks.push(fyght.attack(bobFighterId, aliceFighterId, { from: bob }));
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
      attacks.push(fyght.attack(aliceFighterId, bobFighterId, { from: alice }));
      attacks.push(fyght.attack(bobFighterId, aliceFighterId, { from: bob }));
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
    await fyght.createFighter("Mr. Miyagi", { from: carl });
    // const carlFighterId = (await fyght.balanceOf(carl))[0];
    // const carlFighter = FyghtTestUtils.fighterToObject(await fyght.fighters(carlFighterId));

    const aliceFighterId = (await fyght.balanceOf(alice))[0];
    const bobFighterId = (await fyght.balanceOf(bob))[0];

    const aliceFighter = FyghtTestUtils.fighterToObject(await fyght.fighters(aliceFighterId));
    const bobFighter = FyghtTestUtils.fighterToObject(await fyght.fighters(bobFighterId));

    if (aliceFighter.xp >= 80) {
      await fyght.changeSkin(aliceFighterId, "naked", { from: alice });
    } else if (bobFighter.xp >= 80) {
      await fyght.changeSkin(bobFighterId, "naked", { from: bob });
    } else {
      assert.fail("one of fighters must have xp >= 80");
    }
  });
});
