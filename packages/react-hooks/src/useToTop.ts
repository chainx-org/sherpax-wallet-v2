import {useState, useEffect, useContext} from "react";
import {axiosInstance,shortHah} from './useTransfers'
import {AccountContext} from "@polkadot/react-components-chainx/AccountProvider";
import changeTime from '@polkadot/react-hooks/utils/changeTime'


export interface IDataItem {
  // withdrawalId: number;
  assetId: number;
  balance: string;
  extrinsicHash: string;
  blockTimestamp: string;
  shortHashAddrs:string
}


export default function useToTop() {
  const [toTop,setToTop] = useState<IDataItem[]>([])
  let  { currentAccount } = useContext(AccountContext);


  useEffect(() => {
    //sbtc币 充值 精度8
    axiosInstance.get(`/xgateway/${currentAccount}/deposits`,{
      params:{
        page:0,
        page_size:10
      }
    }).then(res => {
      if(!res) return

      const itemMaps = res.data.items.map((item:IDataItem) => {
        item.shortHashAddrs = shortHah(item.extrinsicHash)
        item.blockTimestamp = changeTime(Number(item.blockTimestamp))
        item.balance = String((Number(item.balance) / Math.pow(10,8)).toFixed(4)) + 'sBtc'
        // item.balance = String((Number(item.balance) / Math.pow(10,8)).toFixed(4)) + (item.assetId === 1 ? ' sBtc' : ' DOGE')
        return item
      })

      console.log(itemMaps,`totop`)

      setToTop(itemMaps)
    })

    //dog币 充值

  },[currentAccount])

  return toTop
}
