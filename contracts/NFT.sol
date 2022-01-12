// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// import openzepellin ERC721 NFT Functionality

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import "@openzeppelin/contracts/utils/Counters.sol";


contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds; // counters allows us to keep track of tokens

    address contractAddress;

    constructor (address marketplaceAddress) ERC721('KryptoBirdz', 'KBIRDS') {
        contractAddress = marketplaceAddress;
    }

    function mintToken(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);

        _setTokenURI(newItemId, tokenURI); 

        setApprovalForAll(contractAddress, true); // give the marketplace approval to transact btw users

        return newItemId;
    }
}