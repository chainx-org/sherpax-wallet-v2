import React from 'react'
import Estimated from './Estimated'
import AssetAllocation from './AssetAllocation'

import useAssetsBalance from "@polkadot/react-hooks/useAssetsBalance";

interface Props  {}

const BalanceChart = (props: Props) => {
  // useAssetsBalance()
  return (
    <div className="balanceChart">
      <Estimated />
      <AssetAllocation />
    </div>
  )
}

export default  BalanceChart
