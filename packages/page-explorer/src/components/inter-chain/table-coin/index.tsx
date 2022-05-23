import React,{useRef} from 'react'
import TableData from "./TableData";

import useToTop from '@polkadot/react-hooks/useToTop'
import {useTranslation} from "@polkadot/app-explorer/translate";
import useWithdrawals, {useTransfer} from "@polkadot/react-hooks/useWithdrawalsAndTransfer";


interface Props  {}

const TableCoin = (props: Props) => {
  const { t } = useTranslation();

  const toTop = useToTop()
  const toTopHeader = useRef([
    //text class colspan
    [t('Top Up'),''],
  ]);

  const transfer = useTransfer()
  const transferHeader = useRef([
    [t('Transfers'),''],
  ]);

  const withdrawals =  useWithdrawals()
  const withdrawalsHeader = useRef([
    [t('Withdrawals'),''],
  ]);



  return (
    <div className="table-coin">
        <TableData source={toTop} header={toTopHeader} empty={'No latest cross-chain asset top up'} className={'top-up'} />
        <TableData source={withdrawals} header={withdrawalsHeader} empty={'No latest cross-chain asset withdrawals'} className={'withdrawals'} />
        <TableData source={transfer} header={transferHeader} empty={'No latest cross-chain asset transfers'} className={'transfer'} />
    </div>
  )
}

export default  TableCoin
