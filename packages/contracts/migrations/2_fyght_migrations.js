const Fyghters = artifacts.require("./Fyghters.sol");
const Dai = artifacts.require("./Dai.sol");

module.exports = async function(deployer) {
  await deployer.deploy(Dai);
  await deployer.deploy(Fyghters, Dai.address);
};
