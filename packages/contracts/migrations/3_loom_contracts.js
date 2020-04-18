const Fyghters = artifacts.require("./Fyghters.sol");
const LoomDai = artifacts.require("./LoomDai.sol");
const dotenv = require("dotenv");

dotenv.config();

const { LOOM_GATEWAY_ADDRESS } = process.env;

module.exports = async function (deployer, network) {
  if (network !== "loom_extdev") {
    return;
  }

  await deployer.deploy(LoomDai, LOOM_GATEWAY_ADDRESS);
  await deployer.deploy(Fyghters, LoomDai.address);
};
