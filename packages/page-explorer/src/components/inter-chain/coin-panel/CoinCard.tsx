import React, {useContext} from 'react'
import {AccountContext} from "@polkadot/react-components-chainx/AccountProvider";

import CardBtns from './CardBtns'
import AssetView from './AssetsView'
import {useAllAssetsBananceAndLocks} from '@polkadot/react-hooks/useAllAssetsBananceAndLocks'

interface IProps {
  assetsID:number,
  title:string,
  coinImg:string,
  unit:string,
  siFormat:string
  addrCoin:string
  minNum:string
}

const CoinCard = (props:IProps) => {
  const {title,coinImg,unit,assetsID,siFormat,addrCoin,minNum} = props
  const { currentAccount } = useContext(AccountContext);

  const assetsInfo = useAllAssetsBananceAndLocks(currentAccount,assetsID)

  return (
    <div className="coin-card">
      <CardBtns title={title} coinImg={coinImg} assetsID={assetsID} siFormat={siFormat} addrCoin={addrCoin} minNum={minNum}/>
      <AssetView unit={unit} assetsInfo={assetsInfo}/>
    </div>
  )
}

export default  CoinCard
