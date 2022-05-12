import React, {useCallback, useEffect,useContext} from 'react'
import Estimated from './Estimated'
import AssetAllocation from './AssetAllocation'

import useAssetsBalance from "@polkadot/react-hooks/useAssetsBalance";

interface Props  {}


const BalanceChart = (props: Props) => {
  let [totalBalance,estimated] = useAssetsBalance()


  return (
    <div className="balanceChart">
      <Estimated estimated={estimated} />
      <AssetAllocation totalBalance={totalBalance} />
    </div>
  )
}

export default  BalanceChart
