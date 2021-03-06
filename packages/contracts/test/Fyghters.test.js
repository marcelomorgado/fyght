// TODO: Setup chain + BN
const FyghtersMock = artifacts.require("mocks/FyghtersMock");
const LoomDai = artifacts.require("LoomDai");
const { BN, expectEvent, expectRevert } = require("./helpers");

const ALICE_FYGHTER_ID = new BN("0");
const BOB_FYGHTER_ID = new BN("1");

const ONE = new BN(`${1e18}`);

const APPROVAL_AMOUNT = new BN("100").mul(ONE);

contract("Fyghters", ([aliceAddress, bobAddress, loomGatewayAddress]) => {
  let fyghtersMock;
  let loomDai;
  let minDeposit;
  let betValue;

  //
  // Utils
  //
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

  beforeEach(async () => {
    loomDai = await LoomDai.new(loomGatewayAddress);
    fyghtersMock = await FyghtersMock.new(loomDai.address);

    await loomDai.mintToGateway(APPROVAL_AMOUNT, { from: loomGatewayAddress });
    await loomDai.transfer(aliceAddress, APPROVAL_AMOUNT, { from: loomGatewayAddress });
    await loomDai.approve(fyghtersMock.address, APPROVAL_AMOUNT, { from: aliceAddress });

    await loomDai.mintToGateway(APPROVAL_AMOUNT, { from: loomGatewayAddress });
    await loomDai.transfer(bobAddress, APPROVAL_AMOUNT, { from: loomGatewayAddress });
    await loomDai.approve(fyghtersMock.address, APPROVAL_AMOUNT, { from: bobAddress });
  });

  beforeEach("should create fyghters", async () => {
    // given
    betValue = await fyghtersMock.getBetValue();

    const fyghterName = "Bruce lee";
    const balanceBefore = await fyghtersMock.balanceOf(aliceAddress);
    expect(`${balanceBefore}`).to.be.equal("0");

    // when
    const tx = await fyghtersMock.create(fyghterName, { from: aliceAddress });

    // then
    const { name, balance } = await fyghtersMock.fyghters(ALICE_FYGHTER_ID);
    expect(name).to.equal(fyghterName);
    expect(`${balance}`).to.equal(`${0}`);

    const balanceAfter = await fyghtersMock.balanceOf(aliceAddress);
    expect(`${balanceAfter}`).to.be.equal("1");
    expectEvent(tx, "FyghterCreated", {
      owner: aliceAddress,
      id: ALICE_FYGHTER_ID,
      name: fyghterName,
    });

    await fyghtersMock.create("Chuck", { from: bobAddress });
  });

  beforeEach("should deposit", async () => {
    // given
    minDeposit = await fyghtersMock.getMinimumDeposit();

    // when
    const txAlice = await fyghtersMock.deposit(ALICE_FYGHTER_ID, minDeposit);
    const txBob = await fyghtersMock.deposit(BOB_FYGHTER_ID, minDeposit);

    // then
    expectEvent(txAlice, "Deposited", {
      id: ALICE_FYGHTER_ID,
      amount: minDeposit,
    });

    expectEvent(txBob, "Deposited", {
      id: BOB_FYGHTER_ID,
      amount: minDeposit,
    });
  });

  describe("withdrawAll", () => {
    it("should withdraw all fyghter balance", async () => {
      // given
      const fyghterId = ALICE_FYGHTER_ID;
      const ownerBalanceBefore = await loomDai.balanceOf(aliceAddress);
      const { balance: fyghterBalanceBefore } = await fyghtersMock.fyghters(fyghterId);

      // when
      const tx = await fyghtersMock.withdrawAll(fyghterId);

      // then
      expectEvent(tx, "Withdrawn", { id: fyghterId, amount: fyghterBalanceBefore });
      const ownerBalanceAfter = await loomDai.balanceOf(aliceAddress);
      const { balance: fyghterBalanceAfter } = await fyghtersMock.fyghters(fyghterId);
      expect(`${fyghterBalanceAfter}`).to.equal("0");
      expect(`${ownerBalanceAfter}`).to.equal(`${ownerBalanceBefore.add(fyghterBalanceBefore)}`);
    });
  });

  describe("getters", () => {
    it("getMinimumDeposit", async () => {
      // when
      const value = await fyghtersMock.getMinimumDeposit();

      // then
      expect(`${value}`).to.equal(`${new BN("5").mul(ONE)}`);
    });

    it("getBetValue", async () => {
      // when
      const value = await fyghtersMock.getBetValue();

      // then
      expect(`${value}`).to.equal(`${new BN("5").mul(ONE)}`);
    });
  });

  describe("create", () => {
    it("shouldn't have more than one fyghter", async () => {
      // when
      const tx = fyghtersMock.create("Second fyghter", { from: aliceAddress });

      // then
      await expectRevert(tx, "Each user can have just one fyghter.");
    });
  });

  describe("rename", () => {
    it("should rename", async () => {
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

    it("shouldn't rename if isn't the owner", async () => {
      // when
      const tx = fyghtersMock.rename(ALICE_FYGHTER_ID, "Never", { from: bobAddress });

      // then
      await expectRevert(tx, "This operation only can be done by the owner.");
    });
  });

  describe("calculateWinProbability", () => {
    it("should calculate the win probability", async () => {
      // given
      const alice = await fyghtersMock.fyghters(ALICE_FYGHTER_ID);
      const bob = await fyghtersMock.fyghters(BOB_FYGHTER_ID);
      expect(`${alice.xp}`).to.equal("1");
      expect(`${bob.xp}`).to.equal("1");

      // when
      const probability = await fyghtersMock.calculateWinProbability(ALICE_FYGHTER_ID, BOB_FYGHTER_ID);

      // then
      expect(`${probability}`).to.equal(`${new BN(`${50e16}`)}`);
    });
  });

  describe("challenge", () => {
    describe("should calculate prizes correclty", () => {
      const challengerId = ALICE_FYGHTER_ID;
      const targetId = BOB_FYGHTER_ID;
      const challengerAddress = aliceAddress;
      const winnerId = challengerId;

      it("should do a challenge (winning a 50% bet)", async () => {
        // given
        const winProbability = new BN(`${50e16}`); // 50%
        const expectedPrize = betValue.div(new BN("2"));

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
        const winProbability = new BN(`${75e16}`); // 75%
        const expectedPrize = betValue.div(new BN("4"));

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
        const winProbability = new BN(`${1e16}`); // 1%
        const expectedPrize = betValue.mul(ONE.sub(winProbability)).div(ONE);

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

    describe("should check fyghters balances correctly", () => {
      const challengerId = ALICE_FYGHTER_ID;
      const targetId = BOB_FYGHTER_ID;
      const challengerAddress = aliceAddress;

      it("should accept if fyghters have enough balances", async () => {
        // given
        const challengerBalance = new BN(`${750e16}`); // $7.50
        await fyghtersMock.updateBalance(challengerId, challengerBalance);

        const targetBalance = new BN(`${250e16}`); // $2.50
        await fyghtersMock.updateBalance(targetId, targetBalance);

        const winProbability = await fyghtersMock.calculateWinProbability(challengerId, targetId);
        expect(`${winProbability}`).to.equal(`${50e16}`); // 50%

        const { gainIfWin, lossIfLose } = await fyghtersMock.calculateGainAndLoss(winProbability);
        expect(targetBalance.gte(gainIfWin)).to.be.true;
        expect(challengerBalance.gte(lossIfLose)).to.be.true;

        // when-then
        await fyghtersMock.challenge(challengerId, targetId, { from: challengerAddress });
      });

      it("shouldn't accept if fyghters have insufficient balances", async () => {
        // given
        const challengerBalance = new BN(`${100e16}`); // $1.00
        await fyghtersMock.updateBalance(challengerId, challengerBalance);

        const targetBalance = new BN(`${249e16}`); // $2.49
        await fyghtersMock.updateBalance(targetId, targetBalance);

        const winProbability = await fyghtersMock.calculateWinProbability(challengerId, targetId);
        expect(`${winProbability}`).to.equal(`${50e16}`); // 50%

        const { gainIfWin, lossIfLose } = await fyghtersMock.calculateGainAndLoss(winProbability);
        expect(targetBalance.gte(gainIfWin)).to.be.false;
        expect(challengerBalance.gte(lossIfLose)).to.be.false;

        // when
        const tx = fyghtersMock.challenge(challengerId, targetId, { from: challengerAddress });

        // then
        await expectRevert(tx, "Your fyghter doesn't have enough balance");
      });
    });
  });

  describe("changeSkin", () => {
    it("shouldn't change skin if hasn't enough xp", async () => {
      // when
      const tx = fyghtersMock.changeSkin(ALICE_FYGHTER_ID, "normal_guy", { from: aliceAddress });

      // then
      await expectRevert(tx, "Your fyghter doesn't have enough XP.");
    });

    it("should change the skin", async () => {
      // given
      const fyghterId = ALICE_FYGHTER_ID;
      const fyghterAddress = aliceAddress;
      const minXpNeeded = 10;
      const newSkin = "normal_guy";

      await fyghtersMock.updateXp(fyghterId, `${new BN(`${minXpNeeded}`)}`, { from: aliceAddress });

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

    it("shouldn't change skin if isn't the owner", async () => {
      // given
      const fyghterId = ALICE_FYGHTER_ID;
      const newSkin = "normal_guy";

      // when
      const tx = fyghtersMock.changeSkin(fyghterId, newSkin, { from: bobAddress });

      // then
      await expectRevert(tx, "This operation only can be done by the owner.");
    });
  });
});
