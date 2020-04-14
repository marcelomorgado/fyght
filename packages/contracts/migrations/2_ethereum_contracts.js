const EthereumDai = artifacts.require("./EthereumDai.sol");

module.exports = async function (deployer, network) {
  if (network !== "ethereum_rinkeby") {
    return;
  }

  await deployer.deploy(EthereumDai);
};
