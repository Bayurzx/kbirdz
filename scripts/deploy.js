// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require('fs');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const KBMarket = await hre.ethers.getContractFactory("kbMarket");
  const kbMarket = await KBMarket.deploy();
  await kbMarket.deployed();
  console.log("KBMarket contract deployed to:", kbMarket.address);


  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(kbMarket.address);
  await nft.deployed();
  console.log("NFT contract deployed to:", nft.address);

  let config = `export const kbMarketAddress = "${kbMarket.address}";
export const nftAddress = "${nft.address}";`

  let data = JSON.stringify(config)
  fs.writeFileSync('config.js', JSON.parse(data))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
