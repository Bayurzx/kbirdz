// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// import openzepellin ERC721 NFT Functionality

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; // security against multiple requests
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract kbMarket is ReentrancyGuard {
    using Counters for Counters.Counter;

    // Track number of items minted and transaction/sales
    Counters.Counter private _tokenIds;
    Counters.Counter private _tokenSold;

    address owner;

    uint256 listingPrice = 0.045 ether;

    constructor() {
        // set the owner
        owner = payable(msg.sender);
    }

    struct MarketToken {
        uint256 itemId; // reminder uint and uint256 are the same
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    // tokenId return which MarketToken with mapping
    mapping(uint256 => MarketToken) private idToMarketToken;

    // listen to event from the frontend
    event MarketTokenMinted(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    // functions to interact with the contract
    // 1 create a market item to put it up for sale
    // create interface for buying and selling

    function mintMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, 'Price cannot be zero');
        require(msg.value == listingPrice, 'Price must be equal to the listing price');

        _tokenIds.increment();
        uint itemId = _tokenIds.current();

        idToMarketToken[itemId] = MarketToken(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        // NFT Transaction
        
    }
}
