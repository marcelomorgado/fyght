const Layer1Dai = artifacts.require("Layer1Dai");
const Layer2Dai = artifacts.require("Layer2Dai");
const waitForExpect = require("wait-for-expect");
const GatewayOracle = require("../utils/GatewayOracle");

const { BN, time } = require("./helpers");

const ZERO = `${new BN("0")}`;
const ONE = `${new BN(`${1e18}`)}`;
const HUNDRED = `${new BN(ONE).muln(100)}`;

const WAIT_FOR_EXPECT_TIMEOUT = time.duration.minutes(1) * 1000;

contract("TransferGateway", ([aliceAddress, , , , , , , , L1GatewayAddress, L2GatewayAddress]) => {
  let L1;
  let L2;

  beforeEach(async () => {
    L1 = await Layer1Dai.new();
    L2 = await Layer2Dai.new(L2GatewayAddress);

    const { address: L1DaiAddress } = L1;
    const { address: L2DaiAddress } = L2;
    const gatewayOracle = new GatewayOracle({ ethereumDaiAddress: L1DaiAddress, loomDaiAddress: L2DaiAddress });
    gatewayOracle.startFromGanache(web3, {
      ethereumGatewayAddress: L1GatewayAddress,
      loomGatewayAddress: L2GatewayAddress,
    });

    await L1.mint(HUNDRED, { from: aliceAddress });
    const balance = await L1.balanceOf(aliceAddress);
    expect(`${balance}`).to.equal(`${HUNDRED}`);
  });

  describe("should deposit and withdraw tokens to layer 2", () => {
    beforeEach("given - should send tokens to the layer 2", async () => {
      // when
      await L1.transfer(L1GatewayAddress, HUNDRED, { from: aliceAddress });

      // then
      await waitForExpect(async () => {
        const aliceL1Balance = await L1.balanceOf(aliceAddress);
        const L1GatewayBalance = await L1.balanceOf(L1GatewayAddress);
        const L2GatewayBalance = await L2.balanceOf(L2GatewayAddress);
        const aliceL2Balance = await L2.balanceOf(aliceAddress);
        expect(`${aliceL1Balance}`).to.equal(ZERO);
        expect(`${L1GatewayBalance}`).to.equal(HUNDRED);
        expect(`${L2GatewayBalance}`).to.equal(ZERO);
        expect(`${aliceL2Balance}`).to.equal(HUNDRED);
      }, WAIT_FOR_EXPECT_TIMEOUT);
    });

    it("should send tokens back to layer 1", async () => {
      // when
      await L2.transfer(L2GatewayAddress, HUNDRED, { from: aliceAddress });
      //   await L1.transfer(aliceAddress, HUNDRED, { from: L1GatewayAddress });

      // then
      await waitForExpect(async () => {
        const aliceL2Balance = await L2.balanceOf(aliceAddress);
        const L2GatewayBalance = await L2.balanceOf(L2GatewayAddress);
        const L1GatewayBalance = await L1.balanceOf(L1GatewayAddress);
        const aliceL1Balance = await L1.balanceOf(aliceAddress);
        expect(`${aliceL2Balance}`).to.equal(ZERO);
        expect(`${L2GatewayBalance}`).to.equal(HUNDRED);
        expect(`${L1GatewayBalance}`).to.equal(ZERO);
        expect(`${aliceL1Balance}`).to.equal(HUNDRED);
      }, WAIT_FOR_EXPECT_TIMEOUT);
    });
  });
});
