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

      setTokenList(tokens)
    })
  },[])

  return tokenList
}
