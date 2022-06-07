const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTmarket", function () {
  it("Should mint and trade NFTs", async function () {
    const Market = await ethers.getContractFactory('NFTmarket');
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    const NFT = await ethers.getContractFactory('NFT');
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('100', 'ether')

    await nft.mintToken('http-t1');
    await nft.mintToken('http-t2');

    await market.makeMarketItem(nftContractAddress, 1, auctionPrice, { value: listingPrice })
    await market.makeMarketItem(nftContractAddress, 2, auctionPrice, { value: listingPrice })

    const [_, buyerAddress] = await ethers.getSigners();

    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, {
      value: auctionPrice
    })

    let items = await market.fetchMarketTokens()

    items = await Promise.all(items.map(async i => {
      const tokenURI = await nft.tokenURI(i.tokenId)
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenURI
      }
      return item
    }))

    console.log('items', items)
  });
});
