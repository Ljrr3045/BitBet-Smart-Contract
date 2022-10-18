const {ethers} = require("hardhat");

async function main() {

  let VRFCoordinator = "0xf0d54349aDdcf704F77AE15b96510dEA15cb7952";
  
  let RamdomNumber = await ethers.getContractFactory("RandomNumber");
  let ramdomNumber = await RamdomNumber.deploy(VRFCoordinator);

  console.log("Contract RamdomNumber address is: ", ramdomNumber.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});