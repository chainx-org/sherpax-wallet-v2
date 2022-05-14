import {useEffect, useState} from "react";
import axios from "axios";

export interface ITokens  {
  chainId: number;
  address: string;
  assetId: number;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}

let tokenListInstance = axios.create({baseURL:'https://raw.githubusercontent.com/chainx-org/token-list/main/'})


export function useTokenList() {
  const [tokenList, setTokenList] = useState<ITokens[]>([])

  useEffect(() => {
    tokenListInstance.get('/chainx.tokenlist.json').then(res => {
      if (!res) return
      const tokens = res.data.tokens

      const tokenList = tokens.filter((item:ITokens) => {
        return item.assetId !== 99
      })

      tokenList.push({symbol:'KSX',logoURI:'',chainId:0,decimals:18,name:'ksx',address:'',assetId:99})


      setTokenList(tokenList)
    })
  },[])

  return tokenList
}
