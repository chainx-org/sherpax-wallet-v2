import {useEffect,useState,useMemo} from 'react'
import axios,{AxiosInstance} from 'axios'
import  useBalances from '@polkadot/app-assets/Balances/useBalances'
import useAssetIds from '@polkadot/app-assets/useAssetIds'
import useAssetInfos from '@polkadot/app-assets/useAssetInfos'
import type { AssetInfoComplete } from '@polkadot/app-assets/types';



interface ITokens  {
  chainId: number;
  address: string;
  assetId: number;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}

let coinInstance:AxiosInstance
let tokenListInstance:AxiosInstance

if (process.env.NODE_ENV === "development") {
  coinInstance  = axios.create({baseURL:'/v1'})
  tokenListInstance = axios.create({baseURL:'https://raw.githubusercontent.com/chainx-org/token-list/main/'})
}  else if (process.env.NODE_ENV === "production") {
  axios.defaults.baseURL = "";
}


export default function useAssetsBalance() {
  const [coinExchangeRate,setCoinExchangeRate] = useState([])
  const [tokenList,setTokenList] = useState([])

  const [infoIndex, setInfoIndex] = useState(0);
  const [info, setInfo] = useState<AssetInfoComplete | null>(null);
  const balances = useBalances(info?.id);
  const ids = useAssetIds();
  const infos = useAssetInfos(ids);

  console.log(ids,infos,`------243242`)



  useEffect(() => {
    coinInstance.get("/getCoinExchangeRate").then(res => {
      if(!res) return
      setCoinExchangeRate(res.data.data)
    })
    tokenListInstance.get('/chainx.tokenlist.json').then(res => {
      if(!res) return
      const tokens = res.data.tokens
      const tokenList = tokens.filter((item:ITokens) => {
        return item.assetId !== 99
      })

      console.log(tokenList,`---tokenList`)

      setTokenList(tokenList)
    })
  },[])

  //链上的接口数据

  const completeInfos = useMemo(
    () => infos
      .filter((i): i is AssetInfoComplete => !!(i.details && i.metadata) && !i.details.supply.isZero())
      .sort((a, b) => a.id.cmp(b.id)),
    [infos]
  );

  useEffect((): void => {
    setInfo(() =>
      infoIndex >= 0 && infoIndex < completeInfos.length
        ? completeInfos[infoIndex]
        : null
    );
  }, [completeInfos, infoIndex]);

  console.log(coinExchangeRate)
}
