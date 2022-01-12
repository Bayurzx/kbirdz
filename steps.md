# Kbirdz NFT Marketplace


## Download DApp Project Dependancies
- Separate the production and developement dependencies

``` bash
npx create-next-app kbirdz # Create nextjs framework
npm install @openzeppelin/contracts web3modal ipfs-http-client axios # install main dependencies
npm install --save-dev hardhat @nomiclabs/hardhat-waffle ethereum-waffle @nomiclabs/hardhat-ethers 'ethers@^5.0.0' chai # install dev dependencies
npm install add -D tailwindcss@latest postcss@latest autoprefixer@latest # install tailwind postcss and their compiler autoprefixer
npx tailwindcss init -p # install the configuration for tailwind
```
- Use hardhat to initialize our smart contract environment with `npx hardhat`

## Setup
- Created a project on Infura, using the mumbai testnet and ethereum mainnet
  - Added necessary details to `hardhat.config.js`
- Changes made in `hardhat.config.js` to optimize our contract...
``` js
solidity: '0.8.4',
// ---
solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
```
- Added a throw-away account in metamask to add the private key which we will be using in the project

## Minting NFT Smart Contract Functionality
- Imported ERC721, ERC721URIStorage, and Counters from openzeppelin
- Inherited ERC721URIStorage as our contract `contract NFT is ERC721URIStorage`
  - Note that in the doc it is written as `contract NFT is ERC721, ERC721URIStorage`
  - But, in the `ERC721URIStorage.sol` contract in modules `ERC721URIStorage inherits ERC721`
- Another difference is that we add our market place address as an arg in the constructor
- Create function `mintToken` 
  - it takes an arg `string memory tokenURI`. Strings are essentially arrays, ew use the `memory` type to conserve gas cost. Default is storage.
- mint token from caller `msg.sender`
- Set the token uri and id `_setTokenURI`
- Give marketplace approval to transact between users `setApprovalForAll`
- Set minted token for sale, and return the ID to display


| vars used | gotten from |
| -----------------  | --------------------  |
| _tokenIds | Counter |
| _mint(address to, uint256 tokenId) | ERC721 |
| _setTokenURI(uint256 tokenId, string memory _tokenURI) | ERC721URIStorage  |
| setApprovalForAll(addr, bool) | ERC721 |