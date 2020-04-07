const Fyghters = artifacts.require("./Fyghters.sol");
const Layer2Dai = artifacts.require("./Layer2Dai.sol");

// TODO: Extract to .env
const gatewayAddress = "0x9c67fD4eAF0497f9820A3FBf782f81D6b6dC4Baa";

module.exports = function (deployer, network) {
  const isLayer2 = ["local_loom", "extdev"].includes(network);
  if (!isLayer2) {
    return;
  }

  deployer.then(async () => {
    await deployer.deploy(Layer2Dai, gatewayAddress);
    await deployer.deploy(Fyghters, Layer2Dai.address);
  });
};
