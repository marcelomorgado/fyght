var FighterOwnership = artifacts.require("./FighterOwnership.sol");

module.exports = function(deployer) {
  deployer.deploy(FighterOwnership);
};
