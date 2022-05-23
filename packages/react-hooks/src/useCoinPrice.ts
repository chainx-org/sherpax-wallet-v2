import {useEffect, useState} from "react";
import {coinInstance} from './useAssetsBalance'

export interface ICoin  {
  "coin": string,
  "price": number
}


export function useCoinPrice() {
  const [coinExchangeRate, setCoinExchangeRate] = useState<ICoin[]>([])
  const [btcDollar,setBtcDollar] = useState([])


  useEffect(() => {
    coinInstance.get("/getCoinExchangeRate").then(res => {
      if(!res) return
      setBtcDollar((res.data.data.filter(item => item.coin === 'BTC'))[0].price)
      setCoinExchangeRate(res.data.data)
    })


  },[])

  return [coinExchangeRate,btcDollar]
}
