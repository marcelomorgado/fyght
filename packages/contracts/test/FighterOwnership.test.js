const FighterOwnership = artifacts.require("FighterOwnership");
const FyghtTestUtils = require("./utils/FyghtTestUtils.js");
/*
  TODO: Test training with incorrect amount of ethers
*/
contract("FighterOwnership", (accounts) => {
  const alice = accounts[0];
  const bob = accounts[1];
  const carl = accounts[2];

  before(async function() {
    // runs before all tests in this block
    this.fighterOwnership = await FighterOwnership.new();
    // this.fighterOwnership = await FighterOwnership.at('0x4a57ee84a884846ce1db676e4726041168e1c4c8');
  });

  after(() => {
    // runs after all tests in this block
  });

  beforeEach(() => {
    // runs before each test in this block
  });

  afterEach(() => {
    // runs after each test in this block
  });

  it("should create a new fighter for first account", async function() {
    const fightersBefore = await this.fighterOwnership.getFightersByOwner(alice);
    assert.equal(fightersBefore.length, 0, "account has fighter in a new deployed contract");

    await this.fighterOwnership.createFighter("Bruce lee", { from: alice });

    const fightersAfter = await this.fighterOwnership.getFightersByOwner(alice);
    assert.equal(fightersAfter.length, 1, "account has no fighter");
  });

  it("fresh new fighter should have correct attributes", async function() {
    const fighterIds = await this.fighterOwnership.getFightersByOwner(alice);
    const fighter = FyghtTestUtils.fighterToObject(await this.fighterOwnership.fighters(fighterIds[0]));

    assert.equal(fighter.name, "Bruce lee", "name != Bruce lee");
    assert.equal(fighter.xp, 1, "xp != 1");
    assert.equal(fighter.qi, 1, "qi != 1");
    assert.equal(fighter.skin, "naked", "skin != naked");
    assert.equal(fighter.winCount, 0, "winCount != 0");
    assert.equal(fighter.lossCount, 0, "lossCount != 0");
  });

  it("rename character should works", async function() {
    const fighterIds = await this.fighterOwnership.getFightersByOwner(alice);
    const fighterId = fighterIds[0];
    let fighter = FyghtTestUtils.fighterToObject(await this.fighterOwnership.fighters(fighterId));

    assert.equal(fighter.name, "Bruce lee", "name != Bruce lee");

    await this.fighterOwnership.renameFighter(fighterId, "Jackie Chan", { from: alice });

    fighter = FyghtTestUtils.fighterToObject(await this.fighterOwnership.fighters(fighterId));
    assert.equal(fighter.name, "Jackie Chan", "name != Jackie Chan");
  });

  // TODO: TEST FREE TRAINING
  it("training should increment qi force and became more expensive", async function() {
    const trainingFee = await this.fighterOwnership.trainingFee.call(); // .toString();//web3.toWei(, 'ether');

    let fighter;
    const fighterIds = await this.fighterOwnership.getFightersByOwner(alice);
    const fighterId = fighterIds[0];

    fighter = FyghtTestUtils.fighterToObject(await this.fighterOwnership.fighters(fighterId));
    assert.equal(fighter.qi, 1, "qi != 1");

    await this.fighterOwnership.training(fighterId, { from: alice, value: trainingFee * fighter.qi });

    fighter = FyghtTestUtils.fighterToObject(await this.fighterOwnership.fighters(fighterId));
    assert.equal(fighter.qi, 2, "qi != 2");

    await this.fighterOwnership.training(fighterId, { from: alice, value: trainingFee * fighter.qi });

    fighter = FyghtTestUtils.fighterToObject(await this.fighterOwnership.fighters(fighterId));
    assert.equal(fighter.qi, 3, "qi != 3");
  });

  it.skip("after fight winner and losses counter should be upgrated and winner should gains xp", async function() {
    await this.fighterOwnership.createFighter("Chuck Norris", { from: bob });

    const aliceFighterId = (await this.fighterOwnership.getFightersByOwner(alice))[0];
    const bobFighterId = (await this.fighterOwnership.getFightersByOwner(bob))[0];

    // let p = await this.fighterOwnership.calculateAttackerProbability(aliceFighterId, bobFighterId);

    const aliceFighterBefore = FyghtTestUtils.fighterToObject(await this.fighterOwnership.fighters(aliceFighterId));
    const bobFighterBefore = FyghtTestUtils.fighterToObject(await this.fighterOwnership.fighters(bobFighterId));

    const receipt = await this.fighterOwnership.attack(bobFighterId, aliceFighterId, { from: bob });
    const winnerId = receipt.logs[0].args.winnerId.toNumber();
    // let winnerId = receipt.logs[receipt.logs.length-1].args.winnerId.toNumber();

    const aliceFighterAfter = FyghtTestUtils.fighterToObject(await this.fighterOwnership.fighters(aliceFighterId));
    const bobFighterAfter = FyghtTestUtils.fighterToObject(await this.fighterOwnership.fighters(bobFighterId));

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

  it("skins should changed correctly", async function() {
    const aliceFighterId = (await this.fighterOwnership.getFightersByOwner(alice))[0];
    const bobFighterId = (await this.fighterOwnership.getFightersByOwner(bob))[0];
    const { fighterOwnership } = this;

    let attacks = [];
    for (let i = 0; i < 10; ++i) {
      attacks.push(this.fighterOwnership.attack(aliceFighterId, bobFighterId, { from: alice }));
      attacks.push(this.fighterOwnership.attack(bobFighterId, aliceFighterId, { from: bob }));
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
      attacks.push(this.fighterOwnership.attack(aliceFighterId, bobFighterId, { from: alice }));
      attacks.push(this.fighterOwnership.attack(bobFighterId, aliceFighterId, { from: bob }));
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

  it.skip("skin changed should works", async function() {
    await this.fighterOwnership.createFighter("Mr. Miyagi", { from: carl });
    // const carlFighterId = (await this.fighterOwnership.getFightersByOwner(carl))[0];
    // const carlFighter = FyghtTestUtils.fighterToObject(await this.fighterOwnership.fighters(carlFighterId));

    const aliceFighterId = (await this.fighterOwnership.getFightersByOwner(alice))[0];
    const bobFighterId = (await this.fighterOwnership.getFightersByOwner(bob))[0];

    const aliceFighter = FyghtTestUtils.fighterToObject(await this.fighterOwnership.fighters(aliceFighterId));
    const bobFighter = FyghtTestUtils.fighterToObject(await this.fighterOwnership.fighters(bobFighterId));

    if (aliceFighter.xp >= 80) {
      await this.fighterOwnership.changeSkin(aliceFighterId, "naked", { from: alice });
    } else if (bobFighter.xp >= 80) {
      await this.fighterOwnership.changeSkin(bobFighterId, "naked", { from: bob });
    } else {
      assert.fail("one of fighters must have xp >= 80");
    }
  });
});
