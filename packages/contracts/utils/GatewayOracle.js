/* eslint-disable class-methods-use-this */
const ethers = require("ethers");
const ETHEREUM_DAI_ABI = require("../../app/src/contracts/Layer1Dai.json").abi;
const LOOM_DAI_ABI = require("../../app/src/contracts/Layer2Dai.json").abi;

const {
  constants: { AddressZero },
} = ethers;

class GatewayOracle {
  constructor({ ethereumDaiAddress, loomDaiAddress }) {
    this.ethereumDaiAddress = ethereumDaiAddress;
    this.loomDaiAddress = loomDaiAddress;
  }

  startFromGanache(web3, { ethereumGatewayAddress, loomGatewayAddress }) {
    const { ethereumDaiAddress, loomDaiAddress } = this;

    const provider = new ethers.providers.Web3Provider(web3.currentProvider);
    const ethereumGatewaySigner = provider.getSigner(ethereumGatewayAddress);
    const loomGatewaySigner = provider.getSigner(loomGatewayAddress);
    this.ethereumDai = new ethers.Contract(ethereumDaiAddress, ETHEREUM_DAI_ABI, ethereumGatewaySigner);
    this.loomDai = new ethers.Contract(loomDaiAddress, LOOM_DAI_ABI, loomGatewaySigner);

    this.start();
  }

  startFromLocalApp(provider, { ethereumGatewayPrivateKey, loomGatewayPrivateKey }) {
    const { ethereumDaiAddress, loomDaiAddress } = this;

    const ethereumGatewaySigner = new ethers.Wallet(ethereumGatewayPrivateKey, provider);
    const loomGatewaySigner = new ethers.Wallet(loomGatewayPrivateKey, provider);

    this.ethereumDai = new ethers.Contract(ethereumDaiAddress, ETHEREUM_DAI_ABI, ethereumGatewaySigner);
    this.loomDai = new ethers.Contract(loomDaiAddress, LOOM_DAI_ABI, loomGatewaySigner);

    this.start();
  }

  async start() {
    const { ethereumDai, loomDai } = this;
    const ethereumGatewayAddress = await ethereumDai.signer.getAddress();
    const loomGatewayAddress = await loomDai.signer.getAddress();

    ethereumDai.on("Transfer", async (sender, recipient, amount) => {
      if (recipient === ethereumGatewayAddress && sender !== AddressZero) {
        const mintTx = await loomDai.mintToGateway(amount);
        await mintTx.wait();
        const transferTx = await loomDai.transfer(sender, amount);
        await transferTx.wait();
      }
    });

    loomDai.on("Transfer", async (sender, recipient, amount) => {
      if (recipient === loomGatewayAddress && sender !== AddressZero) {
        const transferTx = await ethereumDai.transfer(sender, amount);
        await transferTx.wait();
      }
    });
  }

  stop() {
    this.ethereumDai.removeAllListeners();
    this.loomDai.removeAllListeners();
  }
}

module.exports = GatewayOracle;
