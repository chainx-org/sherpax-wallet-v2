import {useEffect, useState, useMemo, useContext, useCallback} from 'react'
import axios,{AxiosInstance} from 'axios'
import { useApi} from '@polkadot/react-hooks';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';

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
  coin: string
}
export interface ICoinData {
  coin:string,
  price:number
}

export interface ITotalBalance {
  coin:string,
  dollar:number
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
  let targetArr:ICurrentBalance[] = []
  const { api } = useApi();
  const {currentAccount} = useContext(AccountContext)
  const [currentBalance,setCurrentBalance] = useState<ICurrentBalance[]>([])
  const [coinExchangeRate,setCoinExchangeRate] = useState<ICoinData[]>([])
  const [tokenList,setTokenList] = useState<ITokens[]>([])
  const [totalBalance,setTotalBalance] = useState<ITotalBalance[]>([])
  const [estimated,setEstimated] = useState<IEstimated>({estimatedDollar:'',estimatedBtc:''})
  const [btcDollar,setBtcDollar] = useState(0)


  useEffect(() => {
    //testInstance json-server 数据
    testInstance.get("/getCoinExchangeRate").then(res => {
      if(!res) return
      setBtcDollar((res.data.data.filter(item => item.coin === 'XBTC'))[0].price)
      setCoinExchangeRate(res.data.data)
    })
    tokenListInstance.get('/chainx.tokenlist.json').then(res => {
      if(!res) return
      const tokens = res.data.tokens
      const tokenList = tokens.filter((item:ITokens) => {
        return item.assetId !== 99
      })

      setTokenList(tokenList)
      tokenList.map( async item => {
        const {assetId} = item
        const res = await api.query.assets.account([assetId],currentAccount)
        if(!res?.toJSON()) return
        const {balance} = res?.toJSON()
        const transBalance = balance / Math.pow(10,item.decimals)
        targetArr.push({transBalance,coin:item.symbol.toUpperCase()})

        if(targetArr.length === tokenList.length) {
          setCurrentBalance(targetArr)
        }
      })
    })
  },[])


  //转为需要的数据
    //1.所有币种对应的美元
    //2.总美元 以及总美元 -> btc
  useEffect(() => {
    const totalBalanceOrigin = coinExchangeRate.map((item:any) => {
      const coin = item.coin.toUpperCase()
      const balanceArr = currentBalance.filter(balance => balance.coin.toUpperCase() === coin)
      if(!balanceArr.length) return

      return {coin:`${balanceArr[0].coin}`,dollar:balanceArr[0].transBalance * item.price }
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


  },[currentBalance,coinExchangeRate])


  return [totalBalance,estimated]
}
