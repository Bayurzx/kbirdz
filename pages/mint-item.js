import { ethers } from 'ethers'
import { useState } from 'react';
import Web3Modal from 'web3modal'
import {create as ipfsHttpClient} from 'ipfs-http-client';
import { kbMarketAddress, nftAddress } from '../config';

import kbMarket from '../artifacts/contracts/kbMarket.sol/kbMarket.json';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import { useRouter } from 'next/router';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0/');

export default function MintItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter()

  // set up a fnuction to fireoff when we update files in out form

  const onChange = async (e) => {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`recieved: ${prog}`)
      });
  
      const url = `https://ipfs.infura.io:5001/api/v0/${added.path}`
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
      const url = `https://ipfs.infura.io:5001/api/v0/${added.path}`
      // run a function that creates sale and passes in the url
      createSale(url)

    } catch (error) {
      console.log('Error uplaoding file: ', error);
    }

  }


}