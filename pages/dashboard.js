import { ethers } from 'ethers'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal'
import { kbMarketAddress, nftAddress } from '../config';

import kbMarket from '../artifacts/contracts/kbMarket.sol/kbMarket.json';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';

export default function Dashboard() {
  const [nfts, setNfts] = useState([]);
  const [sold, setSold] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNfts();
  }, [])

  const loadNfts = async () => {
    // Want to get the msg.sender hook up to the signer to display the nfts


    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()


    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(kbMarketAddress, kbMarket.abi, signer);
    const data = await marketContract.fetchItemsCreated()

    const items = await Promise.all(data.map(async (i) => {
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
    // create a filtered array of items
    const soldItems = items.filter(i => i.sold)
    setSold(soldItems)
    setNfts(items);
    setLoading(false);
  }

  
  if (!loading && !nfts.length) {
    return (
      <h1 className="px-20 py-7 text-4x1">You have not minted any NFTs 😢</h1>
    )
  }



  return (
    <>
      <div className="p-4">
        <h1 className="py-2" style={{fontSize: '26px', backgroundColor: 'white', padding:'20px', fontWeight: 'bold', color: "purple"}}>Tokens Minted</h1>
        <div className="px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {
              nfts.map((nft, i) => (
                <div key={i} className="border shadow rounded-x1 overflow-hidden bg-purple-200 px-5">
                  <img src={nft.image} alt="" />
                  <div className="p-4">
                    <p style={{height: '64px'}} className="text-3x1 font-semibold">
                      {nft.name}
                    </p>
                    <div style={{height:'72px', overflow:'hidden'}}>
                      <p className="text-gray-400">{nft.description} </p>
                    </div>
                  </div>
                  <div className="p-4 bg-black">
                    <p className="text-3x-1 mb-4 font-bold text-white">{nft.price} ETH</p>
                    
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </>
  )
}
