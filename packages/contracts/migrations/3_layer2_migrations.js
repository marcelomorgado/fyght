const Fyghters = artifacts.require("./Fyghters.sol");
const Layer2Dai = artifacts.require("./Layer2Dai.sol");

// TODO: Extract to .env
// Note: This address is the account[9] from DAppChain menmonic phrase
const gatewayAddress = "0xb4CFE11a0c9e781049040DDF9359d4f3447415Db";

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
