var PlatformFactory = artifacts.require("./PlatformFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(PlatformFactory);
};
