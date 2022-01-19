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


## NFT Market Smart Contract
- Imported ERC721, ReentrancyGuard, Counters
- Counters help determine token id and amount sold
- Using the `nonReentrant` modifier, gotten from `ReentrancyGuard.sol`
  - `ReentrancyGuard` basically ensures the function doesn't run twice when called
- We will be doing the following:
  - Track number of items minted and no of transaction/sales
  - Track items not yet sold and total no of items/token
  - Determine who is the owner of the contract
  - Charge a listing fee
  - Deploying to the matic api
- Create mapping for the struct. Mapping is similar to objects in js as it is to implement an associative array
- Create event to tract nft minting `(MarketTokenMinted)`
- Create function for the nft minting `(mintMarketItem)`

> *Note:* Read about zero address in solidiity here: [Zero Address](https://stackoverflow.com/a/48220805/10690280) 


## DApp Smart Contracts (kbMarket) II & III & IV
- Emit the event created, add the emit event to mintMarketItem()
- create another function `createMarketSale()`
- Research own how to calculate your own percentage!
- Create a funciton for minting, buying and selling
  - Also, return the number of unsold items
- Return NFTs the users has purchased
  - Get the total item count
  - Another counter for each individual user
  - Loop through to chck for the purchased NFTs
- We do the same for the NFTs created by the seller

## Full Testing - DApp Smart Contract Market
- Setting up test in `test\sample-test.js`
- Tests
  - Geting address: NFT and market address
  - get listing price and auction price
  - for minting
  - to make market items
  - testing create market sale with different addresses

## Hardhat Compiling NFTs & Running Tests
- Wrote down tests in `test\sample-test.js`
- There is an issue with the code.
  - For some reason, the declaration `uint currentIndex = 0;` is not picked up outside the loop. It causes the error `code 0x32`
  - I was able to solve this issue after commit: 6194d0e7b91a5440acceff9b4c8c059ab3f1bf91. I forgot to add this line `idToMarketToken[itemId].owner = payable(msg.sender);`

## DApp Application UI & Styling
- Added this code below to `styles\globals.css`
``` css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
- Changed the old code in `tailwind.config.js` to this code below, to enable it work. Content was left out in the tutorial
```js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## Styling The DApp UI
- Worked on `styles\app.css`


## Deploying Smart Contracts & Running A Local Blockchain
- Modified the `sample-scripts.js` in `scripts` to `deploy.js`
- Wrote the code for the deployment of `kbMarket` and `NFT` (.sol) inside the main function
- defined config and data to be able to save our contract address in a file, `config.js` when deployed
  - Note that in `fs.writeFileSync('config.js', JSON.parse(data))` the first arg, which is path must be relatively from project not and not relatively from your current file e.g. `../config`
- Run the following commands to start the local node provided by hardhat and to run the contract

``` bash
npx hardhat node #Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
npx hardhat run scripts/deploy.js --network localhost
```

## More details from the terminal
``` powershell
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.

Account #0: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

Account #2: 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc (10000 ETH)
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a

Account #3: 0x90f79bf6eb2c4f870365e785982e1f101e93b906 (10000 ETH)
Private Key: 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6

Account #4: 0x15d34aaf54267db7d7c367839aaf71a00a2c6a65 (10000 ETH)
Private Key: 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a

Account #5: 0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc (10000 ETH)
Private Key: 0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba

Account #6: 0x976ea74026e726554db657fa54763abd0c3a0aa9 (10000 ETH)
Private Key: 0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e

Account #7: 0x14dc79964da2c08b23698b3d3cc7ca32193d9955 (10000 ETH)
Private Key: 0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356

Account #8: 0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f (10000 ETH)
Private Key: 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97

Account #9: 0xa0ee7a142d267c1f36714e4a8f75612f20a79720 (10000 ETH)
Private Key: 0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6

Account #10: 0xbcd4042de499d14e55001ccbb24a551f3b954096 (10000 ETH)
Private Key: 0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897

Account #11: 0x71be63f3384f5fb98995898a86b02fb2426c5788 (10000 ETH)
Private Key: 0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82

Account #12: 0xfabb0ac9d68b0b445fb7357272ff202c5651694a (10000 ETH)
Private Key: 0xa267530f49f8280200edf313ee7af6b827f2a8bce2897751d06a843f644967b1

Account #13: 0x1cbd3b2770909d4e10f157cabc84c7264073c9ec (10000 ETH)
Private Key: 0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd

Account #14: 0xdf3e18d64bc6a983f673ab319ccae4f1a57c7097 (10000 ETH)
Private Key: 0xc526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa

Account #15: 0xcd3b766ccdd6ae721141f452c550ca635964ce71 (10000 ETH)
Private Key: 0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61

Account #16: 0x2546bcd3c84621e976d8185a91a922ae77ecec30 (10000 ETH)
Private Key: 0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0

Account #17: 0xbda5747bfd65f08deb54cb465eb87d40e51b197e (10000 ETH)
Private Key: 0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd

Account #18: 0xdd2fd4581271e230360230f9337d5c0430bf44c0 (10000 ETH)
Private Key: 0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0

Account #19: 0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199 (10000 ETH)
Private Key: 0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.

hardhat_addCompilationResult
web3_clientVersion (2)
eth_chainId
eth_accounts
web3_clientVersion
eth_chainId
eth_accounts
eth_blockNumber
eth_chainId (2)
eth_estimateGas
eth_getBlockByNumber
eth_feeHistory
eth_sendTransaction
  Contract deployment: kbMarket
  Contract address:    0x5fbdb2315678afecb367f032d93f642f64180aa3
  Transaction:         0x12f61e10f65ad8e0ded555827a09b513dd48166c3a10cb3deb31561004c41d29
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  Value:               0 ETH
  Gas used:            816263 of 816263
  Block #1:            0x49b09ce81391332649c8cd6f8188cb55e017a3975b3b75ac69f7d403a18d6ff4

eth_chainId
eth_getTransactionByHash
eth_chainId
eth_getTransactionReceipt
eth_accounts
eth_chainId
eth_estimateGas
eth_feeHistory
eth_sendTransaction
  Contract deployment: NFT
  Contract address:    0xe7f1725e7734ce288f8367e1bb143e90bb3f0512
  Transaction:         0xa85738032d5862432b665070e60d2ffd3237d1d535c7bf62090dfd4a1b4abb17
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  Value:               0 ETH
  Gas used:            1394427 of 1394427
  Block #2:            0xd7041effc45c505557a1e86fb6954bc55a46dbb0d3f8bb8414cda780df703cab

eth_chainId
eth_getTransactionByHash
eth_chainId
eth_getTransactionReceipt
web3_clientVersion
eth_chainId
eth_accounts
eth_blockNumber
eth_chainId (2)
eth_estimateGas
eth_getBlockByNumber
eth_feeHistory
eth_sendTransaction
  Contract deployment: kbMarket
  Contract address:    0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0
  Transaction:         0xb58f6ddd1a71c4e30506430b9267753845962a297ffa68767b3ddb92b3eea505
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  Value:               0 ETH
  Gas used:            816263 of 816263
  Block #3:            0xcfe9b657aff9606e602379852f9734751ae3109b9d52cd661dba27d1925d34f3

eth_chainId
eth_getTransactionByHash
eth_chainId
eth_getTransactionReceipt
eth_accounts
eth_chainId
eth_estimateGas
eth_feeHistory
eth_sendTransaction
  Contract deployment: NFT
  Contract address:    0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9
  Transaction:         0xc8b10d77b557c4eb99a826d6793cc670512290cb926255dc3d2655fa36a6709c
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  Value:               0 ETH
  Gas used:            1394427 of 1394427
  Block #4:            0xaea23f51195421def081194080a9b4d416f2608e150bee9433cd12f7c7e7a164

eth_chainId
eth_getTransactionByHash
eth_chainId
eth_getTransactionReceipt

```

## Loading NFTs To The Market Function
- Some naming are different from the tutorial
- created the loadNfts function

## Mapping Out NFTs with Tailwind & NexJs
- Added condition statement to display no data component in pages\index.js:ln 70, Col 3
- Fixed errors in deploy.js, forgot to make addresses string

## File Hosting with IPFS
- Copied link for IPFS from infura at [blog](https://blog.infura.io/getting-started-with-infuras-ipfs-service-updated-june-2021/)
- Check out [mint-items.js](..\pages\mint-item.js)

## Minting NFTs Final Functionality
- created the createSale function

##  Front End Form For Blockchain Interaction
- Created a form in `pages\mint-item.js` along with the necessary function

## Display Purchased NFTs on DApp
- create a new file called `pages\my-nfts.js`
  - Basically copied the `pages\index.js`
- Made some changes like
  - Removed the buyNFTs
  - Removed the button
  - created the signer variable
  - changed form provider to signer in the defined `marketContract` variable

## Final DApp Code Part II - Final Conclusion
- Added dashboard, made slight changes
- Notice that after minting, we get directed to `Marketplace`. That is thanks to `router.push('./')`
- Notice that next automatically sets our routes. It detects the name of the file in pages and routes there
- 