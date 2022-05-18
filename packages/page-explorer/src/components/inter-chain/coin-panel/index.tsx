import React from 'react'
import CoinCard from "./Coin-card"


interface Props  {}

const CoinPanel = (props: Props) => {
  return (
    <div className="coin-panel">
      <CoinCard />
    </div>
  )
}

export default  CoinPanel
