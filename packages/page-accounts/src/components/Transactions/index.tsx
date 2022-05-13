import React, {useContext, useRef} from 'react'
import TransfersCrossTable from "./TransfersCrossTable";
import TransfersTable from "./TransfersTable";
import Head from '@polkadot/react-components/ITable/Head'
import {useTranslation} from "@polkadot/app-accounts-chainx/translate";
import {useTransfers,useTransfersCross} from '@polkadot/react-hooks/useTransfers'


interface Props  {}

const Transactions = (props: Props) => {
  const { t } = useTranslation();

  const transfersData = useTransfers()




  const header = useRef([
    //text class colspan
    [t('transactions'),''],
    [t(''),'move']
  ]);

  return (
    <div className='transactions'>
      <Head header={header.current}></Head>
      <div className="tableList">
        <TransfersTable transfersData={transfersData}></TransfersTable>
        <TransfersCrossTable></TransfersCrossTable>
      </div>
    </div>
  )
}

export default  Transactions
