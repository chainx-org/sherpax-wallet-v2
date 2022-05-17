import React,{useContext, useEffect, useState} from 'react'
import  axios from 'axios'
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import {TokenListContext} from "@polkadot/react-components-chainx/TokenListProvider";
import changeTime from '@polkadot/react-hooks/utils/changeTime'



export let BASE_URL = ''

if (process.env.NODE_ENV === 'development') {
  ///pre地址
  BASE_URL = 'https://multiscan-api.coming.chat/sherpax'
} else if (process.env.NODE_ENV === 'production') {
  if (window.location.href.includes('pre')) {
    BASE_URL = 'https://multiscan-api-pre.coming.chat/sherpax'
  } else {
    BASE_URL = 'https://multiscan-api.coming.chat/sherpax'
  }
}


export const axiosInstance = axios.create({
  baseURL:BASE_URL
})

export function shortHah(value:string) {
  return value.substring(0,7).concat('...').concat(value.substring(value.length - 5))
}

export function useTransfers() {
  const tokenList = useContext(TokenListContext)
  const { currentAccount } = useContext(AccountContext);


  const  [transfer,setTransfer] = useState([])

  useEffect(() => {
    //请求交易数据
    axiosInstance.get('/balanceTransfer',{
      params:{
        address:currentAccount,
        page:0,
        page_size:10
      }
    }).then(res => {
      if(!res.data.items.length) {
        setTransfer([])
        return
      }

      const transferMap = res.data.items.map((item:any) => {
        item.blockTime = changeTime(item.blockTime)
        item.balance = `${Number((item.balance / Math.pow(10,18))).toFixed(4)} KSX`
        item.transferHash =  shortHah(item.extrinsicHash)
        return item
      })


      setTransfer(transferMap)
    })
  },[currentAccount])

  return transfer
}


export function useTransfersCross() {
  const tokenList = useContext(TokenListContext)
  const { currentAccount } = useContext(AccountContext);
  const  [transferCross,setTransferCross] = useState([])
  useEffect(() => {

    //请求跨链资产交易
    axiosInstance.get(`/palletAssets/${currentAccount}/transfers`,{
      params:{
        asset_ids:'0,1,2,3,4,5,6',
        page:0,
        page_size:10
      }
    }).then(res => {
      if(!res.data.items.length) {
        setTransferCross([])
        return
      }

      const transferCrossMap = res.data.items.map((item:any) => {
        const [token] = tokenList.filter(token => token.assetId === item.assetId)

        item.blockTime = changeTime(item.blockTimestamp)
        item.balance = `${Number((item.balance / Math.pow(10, token.decimals))).toFixed(4)} ${token.symbol}`
        item.logoUrl = token.logoURI
        item.transferHash = shortHah(item.extrinsicHash)


        return item
      })


      setTransferCross((transferCrossMap))
    })
  },[currentAccount])


  return transferCross
}



