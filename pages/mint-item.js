import { ethers } from 'ethers'
import { useState } from 'react';
import Web3Modal from 'web3modal'
import {create as ipfsHttpClient} from 'ipfs-http-client';
import { kbMarketAddress, nftAddress } from '../config';

import kbMarket from '../artifacts/contracts/kbMarket.sol/kbMarket.json';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import { useRouter } from 'next/router';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

export default function MintItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter()

  // set up a fnuction to fireoff when we update files in out form

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`recieved: ${prog}`)
      });
  
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url);
      
    } catch (error) {
      console.log(error);
    }
  }

  const createMarket = async () => {
    const {name, description, price} = formInput
    if (!name || !description || !price || !fileUrl) return;
    // upload to ipfs
    const data = JSON.stringify({
      name, description, image:fileUrl
    })

    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      // run a function that creates sale and passes in the url
      createSale(url)

    } catch (error) {
      console.log('Error uploading file: ', error);
    }

  }

  const createSale = async (url) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    // we want to create the token
    let contract = new ethers.Contract(nftAddress, NFT.abi, signer)
    let transaction = await contract.mintToken(url);
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()
    const price = ethers.utils.parseUnits(formInput.price, 'ether')

    // list the items for sale in teh marketplace
    contract = new ethers.Contract(kbMarketAddress, kbMarket.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    // 
    transaction = await contract.makeMarketItem(nftAddress, tokenId, price, {value: listingPrice})
    await transaction.wait()

    router.push('./');
  }

  return (
    <div className="flex justify-center mt-12">
      <div className="w-1/2 flex flex-col p-16 bg-purple-200">
        <h1 className="py-2" style={{ fontSize: '26px', backgroundColor: 'white', padding: '20px', fontWeight: 'bold', color: "purple" }}>Mint Tokens</h1>

        <input 
          type="text" 
          placeholder='Asset Name'
          className="mt-8 border rounded p-4" 
          onChange={e => setFormInput({...formInput, name: e.target.value})}
        />
        <textarea 
          type="text" 
          placeholder='Asset Description'
          className="mt-8 border rounded p-4" 
          onChange={e => setFormInput({...formInput, description: e.target.value})}
        />
        <input 
          type="text" 
          placeholder='Asset Price in Eth'
          className="mt-8 border rounded p-4" 
          onChange={e => setFormInput({...formInput, price: e.target.value})}
        />
        <input 
          type="file" 
          name='Asset'
          className="mt-4" 
          onChange={onFileChange}
        /> 
        {
          fileUrl && (
            <img src={fileUrl} className='rounded mt-4' width='350px' />
          )
        }
        <button 
          className="font-bold mt-5 bg-purple-500 text-white rounded py-3 shadow-lg"
          onClick={createMarket}
        >
          Mint NFT
        </button>
      </div>
    </div>

  )
  

}