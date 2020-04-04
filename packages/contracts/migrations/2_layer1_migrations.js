const Layer1Dai = artifacts.require("./Layer1Dai.sol");

module.exports = function (deployer, network) {
  const isLayer1 = ["local", "rinkeby"].includes(network);
  if (!isLayer1) {
    return;
  }

  deployer.deploy(Layer1Dai);
};
