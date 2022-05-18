import React from 'react'
import TableCoin from './table-coin'
import CoinPanel from "./coin-panel";

interface Props  {}

const InterChain = (props: Props) => {
  return (
    <div className="inter-chain">
      <CoinPanel/>
      <TableCoin />
    </div>
  )
}

export default InterChain
