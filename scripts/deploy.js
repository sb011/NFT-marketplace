const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const NFTmarket = await hre.ethers.getContractFactory("NFTmarket");
  const nftmarket = await NFTmarket.deploy();
  await nftmarket.deployed();
  console.log("NFTmarket contract deployed to:", nftmarket.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftmarket.address);
  await nft.deployed();
  console.log("NFT contract deployed to:", nft.address);

  let config = `
  export const nftmarketaddress = ${nftmarket.address}
  export const nftaddress = ${nft.address} 
  `

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
