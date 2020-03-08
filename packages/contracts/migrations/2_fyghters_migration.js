const Fyghters = artifacts.require("./Fyghters.sol");

module.exports = function(deployer) {
  deployer.deploy(Fyghters);
};
