const PlatformFactory = artifacts.require("./PlatformFactory.sol");

contract("PlatformFactory", function (accounts) {
  let meta

  before(async function () {
    meta = await PlatformFactory.deployed()
  })

  it("should get platform fee", async function () {
    const fee = await meta.platformFeePercentage.call();
    assert.equal(fee, 1, "Invalid fee");
  });
});
