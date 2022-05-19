import React from 'react'
import CoinCard from "./CoinCard"


interface Props  {}

const CoinPanel = (props: Props) => {
  return (
    <div className="coin-panel">
      <CoinCard />
    </div>
  )
}

export default  CoinPanel
