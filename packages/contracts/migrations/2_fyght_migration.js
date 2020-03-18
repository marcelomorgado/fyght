const Fyghters = artifacts.require("./Fyghters.sol");
const Dai = artifacts.require("./Dai.sol");

module.exports = function(deployer) {
  (async () => {
    await deployer.deploy(Dai);
    await deployer.deploy(Fyghters, Dai.address);
  })();
};
