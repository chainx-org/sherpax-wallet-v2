import React from 'react'

interface Props  {}

const Estimated = (props: Props) => {
  return (
    <div className='estimated'>
      <div className="estimated-tit">Estimated Balance</div>
      <div className="btc-balance">
        0.003BTC≈ $1,730.07
      </div>
    </div>
  )
}

export default  Estimated
