import React from 'react'

interface Props  {}

const AssetsView = (props: Props) => {
  return (
    <div className="assets-view">
      <div className="balance">
        <p >Balance</p>
        <h2 className="balance-tit" >100.123 SBTC</h2>
      </div>
      <div className="transferable">
        <p>Transferable</p>
        <h2>9999990.0010 KSX</h2>
      </div>
      <div className="reserved">
        <p>Withdrawal Reserved</p>
        <h2>9999990.0010 KSX</h2>
      </div>
    </div>
  )
}

export default  AssetsView
