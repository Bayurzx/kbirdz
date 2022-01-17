import {ethers} from 'ethers'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal'
import { kbMarketAddress, nftAddress} from '../config';

import kbMarket from '../artifacts/contracts/kbMarket.sol/kbMarket.json';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNfts();
  }, [])

  const loadNfts = async () => {
    // ***provider, tokenContract, marketContract, data for our marketItems***

    const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(kbMarketAddress, kbMarket.abi, provider);
    const data = await marketContract.fetchMarketTokens()

    const items = await Promise.all(data.map(async () => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      // we want to get the token metadata
      const meta = await axios.get(tokenUri);
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')

      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,

      }

      return item;

    }))
    
    setNfts(items);
    setLoading(false);

  }

  // function to buy 

  return (
    <div>
      KBIRDZ MARKETPLACE

    </div>
  )
}
