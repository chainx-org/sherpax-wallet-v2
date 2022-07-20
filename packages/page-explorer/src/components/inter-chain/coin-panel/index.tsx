import React from 'react'
import CoinCard from "./CoinCard"
import {cardList} from '../data-local'


interface Props  {}

const CoinPanel = (props: Props) => {
  return (
    <div className="coin-panel">
      {cardList.map(item => {
        return <CoinCard key={item.assetsID} {...item} />
      })}

    </div>
  )
}

export default  CoinPanel
