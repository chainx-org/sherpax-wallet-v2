import React, {useRef} from 'react'
import {ITable} from "@polkadot/react-components";
import {useTranslation} from "@polkadot/app-explorer/translate";
import useWithdrawals,{IDataItem} from '@polkadot/react-hooks/useWithdrawals'
import sBtc_svg from '@polkadot/app-explorer/svg/sBTC.svg'

interface Props  {}

const Withdrawals = (props: Props) => {
  const { t } = useTranslation();

  const withdrawals =  useWithdrawals()

  const header = useRef([
    [t('Withdrawals'),''],
  ]);
  return (
    <div className="withdrawals">
      <ITable header={header.current} empty="No latest cross-chain asset withdrawals" className="withdrawals-table" >
        {withdrawals.map((item:IDataItem) => {
          return (
            <tr key={item.extrinsicHash}>
              <td>
                <img src={item.assetId === 1 ? sBtc_svg : '1'} alt="coin-logo" />
                {item.balance}
              </td>
              <td> <a href={`https://scan${location.host.includes('pre') ? '-pre' : ''}.sherpax.io/trade/${item.extrinsicHash}`} target="_blank">{item.shortHashAddrs}</a> </td>
              <td>{item.blockTimestamp}</td>
            </tr>
          )
        })}
      </ITable>
    </div>
  )
}

export default  Withdrawals
