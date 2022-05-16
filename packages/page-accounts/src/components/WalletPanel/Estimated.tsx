import React from 'react'

import type {IEstimated} from "@polkadot/react-hooks/useAssetsBalance";


interface Props  {
  estimated:IEstimated
}

const Estimated = ({estimated:{estimatedBtc,estimatedDollar}}: Props) => {
  return (
    <div className='estimated'>
      <div className="estimated-tit">
        Estimated Balance
      </div>
      <div className="btc-balance">
        <span>{estimatedBtc} BTC </span>
         ≈
        <span> $ {estimatedDollar} </span>
      </div>
    </div>
  )
}

export default  Estimated
