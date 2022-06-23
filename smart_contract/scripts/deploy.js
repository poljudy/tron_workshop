const main = async () => {
  const platformFactory = await hre.ethers.getContractFactory("Platform");
  const platformContract = await platformFactory.deploy();

  await platformContract.deployed();

  console.log("Platform address: ", platformContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();