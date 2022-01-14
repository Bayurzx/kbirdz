const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("kbMarket", function () {
  it("It should mint and trade NFTs", async function () {
    const Market = await ethers.getContractFactory('kbMarket');
    const market = await Market.deploy();
    await market.deployed();
    const marketContractAddress = market.address
    
    const NFT = await ethers.getContractFactory('NFT');
    const nft = await NFT.deploy();
    await nft.deployed();
    const nftContractAddress = nft.address

    // test for receiving listingPrice and auction price
    let listingPrice = await market.getListingPrice().toString();

    const auctionPrice = ethers.utils.parseUnits('100', 'ethers');

    // test for minting
    await nft.mintToken('https-t1');
    await nft.mintToken('https-t2');

    await market.makeMarketItem(nftContractAddress, 1, auctionPrice, {value: listingPrice});
    await market.makeMarketItem(nftContractAddress, 2, auctionPrice, {value: listingPrice});

    // test for different addresses from different users - test accounts
    // return array of available addresses

    const [_, buyerAddress] = await ethers.getSigners();
    
    // create market sale with address, id and price
    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, {value: auctionPrice});
    
    const items = await market.fetchMarketTokens()
    
    console.log('items', items);
  });
});
