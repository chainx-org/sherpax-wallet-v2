import React from 'react'
import TopUp from "./TopUp";
import Withdrawals from './Withdrawals'


interface Props  {}

const TableCoin = (props: Props) => {
  return (
    <div className="table-coin">
      <TopUp />
      <Withdrawals />
    </div>
  )
}

export default  TableCoin
