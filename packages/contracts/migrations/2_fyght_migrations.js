const Fyghters = artifacts.require("./Fyghters.sol");
const LoomDai = artifacts.require("./LoomDai.sol");

module.exports = async function (deployer, network, accounts) {
  // TODO: Change to correct address
  const [, , loomGatewayAddress] = accounts;

  await deployer.deploy(LoomDai, loomGatewayAddress);
  await deployer.deploy(Fyghters, LoomDai.address);
};
