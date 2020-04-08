const Fyghters = artifacts.require("./Fyghters.sol");
const LoomDai = artifacts.require("./LoomDai.sol");

module.exports = async function (deployer) {
  await deployer.deploy(LoomDai);
  await deployer.deploy(Fyghters, LoomDai.address);
};
