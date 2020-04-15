const Fyghters = artifacts.require("./Fyghters.sol");
const LoomDai = artifacts.require("./LoomDai.sol");

// TODO: Get from .env file
const LOOM_GATEWAY_ADDRESS = "0xe754d9518bf4a9c63476891ef9AA7d91C8236A5D";

module.exports = async function (deployer, network) {
  if (network !== "loom_extdev") {
    return;
  }

  await deployer.deploy(LoomDai, LOOM_GATEWAY_ADDRESS);
  await deployer.deploy(Fyghters, LoomDai.address);
};
