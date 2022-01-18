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

    address payable owner;

    uint256 listingPrice = 0.045 ether;

    constructor() {
        // set the owner
        owner = payable(msg.sender);
    }

    struct MarketToken {
        uint itemId; // reminder uint and uint256 are the same
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
        uint indexed itemId,
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

    function makeMarketItem(
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
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketTokenMinted(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );

    }

    function createMarketSale (
        address nftContract,
        uint itemId
    ) public payable nonReentrant {
        uint price = idToMarketToken[itemId].price;
        uint tokenId = idToMarketToken[itemId].tokenId;

        require(msg.value == price, "Please submit the correct asking price");

        // transfer the amount to the seller
        idToMarketToken[itemId].seller.transfer(msg.value); // might calculate own percentage here 
        // transfer the token from contract address to the buyer
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketToken[itemId].owner = payable(msg.sender);

        // confirm transaction success in struct
        idToMarketToken[itemId].sold = true;

        _tokenSold.increment(); // document sale

        // transfer from the owner the price
        payable(owner).transfer(listingPrice);
    }
    
    function fetchMarketTokens( ) view public returns (MarketToken[] memory) {
         uint itemCount = _tokenIds.current();
         uint unSoldItemCount = _tokenIds.current() - _tokenSold.current();
         uint currentIndex = 0; // Issue causing panic code 0x32

        MarketToken[] memory items = new MarketToken[](unSoldItemCount);

        //  loop over no. of items created
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketToken[i+1].owner == address(0)) {
                uint currentId = i + 1;
                MarketToken storage currentItem = idToMarketToken[currentId];
                items[currentIndex] = currentItem;
                ++currentIndex;
            }
        }
        return items;
    }

    function fetchMyNFTs( ) view public returns (MarketToken[] memory) {
        uint totalItemCount = _tokenIds.current();

        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketToken[i+1].owner == msg.sender) {
                ++itemCount;
            }
        }

        // another loop for the amount you havr purchased, check to see if owner is msg.sender
        MarketToken[] memory items = new MarketToken[](itemCount);

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketToken[i+1].owner == msg.sender) {
                uint256 currentId = idToMarketToken[i+1].itemId;
                // current array
                MarketToken storage currentItem = idToMarketToken[currentId];
                items[currentIndex] = currentItem;
                ++currentIndex;
            }
        }
        return items;
    }

    function fetchItemsCreated( ) view public returns (MarketToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketToken[i+1].seller == msg.sender) {
                ++itemCount;
            }
        }

        MarketToken[] memory items = new MarketToken[](itemCount);

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketToken[i+1].seller == msg.sender) {
                uint256 currentId = idToMarketToken[i+1].itemId;
                // current array
                MarketToken storage currentItem = idToMarketToken[currentId];
                items[currentIndex] = currentItem;
                ++currentIndex;
            }
        }
        return items;
    }

}
