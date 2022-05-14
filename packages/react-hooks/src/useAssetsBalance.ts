import {useEffect, useState, useMemo, useContext, useCallback} from 'react'
import axios,{AxiosInstance} from 'axios'

import {useApi} from '@polkadot/react-hooks';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import { KSXBalanceContext } from '@polkadot/react-components-chainx/KSXBalanceProvider';
import {TokenListContext} from '@polkadot/react-components-chainx/TokenListProvider'


interface ITokens  {
  chainId: number;
  address: string;
  assetId: number;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}
interface ICurrentBalance {
  transBalance:number
  coin: string,
  logo:string,
}
export interface ICoinData {
  coin:string,
  price:number
}

export interface ITotalBalance {
  coin:string,
  dollar:number,
  percent:number,
  logo:string,
  coinNum:number,
}

export interface IEstimated {
  estimatedDollar:string,
  estimatedBtc:string
}


let coinInstance:AxiosInstance
let tokenListInstance:AxiosInstance
let testInstance:AxiosInstance

if (process.env.NODE_ENV === "development") {
  coinInstance  = axios.create({baseURL:'/v1'})
  testInstance = axios.create({baseURL:'http://localhost:3004'})
  tokenListInstance = axios.create({baseURL:'https://raw.githubusercontent.com/chainx-org/token-list/main/'})
}  else if (process.env.NODE_ENV === "production") {
  axios.defaults.baseURL = "";
}


export default  function  useAssetsBalance() {
  const {currentAccount} = useContext(AccountContext)
  const [currentBalance,setCurrentBalance] = useState<ICurrentBalance[]>([])
  const [coinExchangeRate,setCoinExchangeRate] = useState<ICoinData[]>([])
  // const [tokenList,setTokenList] = useState<ITokens[]>([])
  const [totalBalance,setTotalBalance] = useState<ITotalBalance[]>([])
  const [estimated,setEstimated] = useState<IEstimated>({estimatedDollar:'',estimatedBtc:''})
  const [btcDollar,setBtcDollar] = useState(0)
  const { api } = useApi();
  let targetArr:ICurrentBalance[] = []
  //获取ksx
  const {allKsxBalance} = useContext(KSXBalanceContext)
  //获取tokenList
  const tokenList = useContext(TokenListContext)


  useEffect(() => {
    setCurrentBalance([])
    //testInstance json-server 数据
    testInstance.get("/getCoinExchangeRate").then(res => {
      if(!res) return
      setBtcDollar((res.data.data.filter(item => item.coin === 'XBTC'))[0].price)
      setCoinExchangeRate(res.data.data)
    })


    tokenList.map( async item => {
      const {assetId} = item
      if(assetId === 99) {
        targetArr.push({transBalance:allKsxBalance / Math.pow(10,18),coin:item.symbol.toUpperCase(),logo:item.logoURI})
        return
      }
      const res = await api.query.assets.account([assetId],currentAccount)


      if(!res?.toJSON()) {
        targetArr.push({transBalance:0,coin:item.symbol.toUpperCase(),logo:item.logoURI})

        if(targetArr.length === tokenList.length) {
          setCurrentBalance(targetArr)
        }
        return
      }


      const {balance} = res?.toJSON()
      const transBalance = balance / Math.pow(10,item.decimals)
      targetArr.push({transBalance,coin:item.symbol.toUpperCase(),logo:item.logoURI})

      if(targetArr.length === tokenList.length) {
        setCurrentBalance(targetArr)
      }

    })
  },[currentAccount,tokenList,allKsxBalance])


  //转为需要的数据
    //1.所有币种对应的美元
    //2.总美元 以及总美元 -> btc
  useEffect(() => {
    const totalBalanceOrigin = coinExchangeRate.map((item:any) => {
      const coin = item.coin.toUpperCase()
      const [balanceArr] = currentBalance.filter(balance => balance.coin.toUpperCase() === coin)
      if(!balanceArr) return

      return {
        coin:`${balanceArr.coin}`,
        dollar:balanceArr.transBalance * item.price,
        percent: (balanceArr.transBalance * item.price) / Number(estimated.estimatedDollar),
        logo:balanceArr.logo,
        coinNum:balanceArr.transBalance
      }
    })

    const totalBalance = totalBalanceOrigin.sort((a:any,b:any) =>  b.dollar - a.dollar).filter(Boolean)






    setTotalBalance(totalBalance)

    const estimatedDollar = totalBalance.reduce(((prev:any,current:any) => {
      return prev + current.dollar
    }),0)
    let estimatedBtc = (estimatedDollar / btcDollar).toFixed(3)

    if(estimatedBtc == 'NaN') {
      estimatedBtc = '0.000'
    }

    setEstimated({estimatedDollar:Number(estimatedDollar.toFixed(2)).toLocaleString(),estimatedBtc})


  },[currentBalance,coinExchangeRate,estimated.estimatedDollar])




  return [totalBalance,estimated]
}
