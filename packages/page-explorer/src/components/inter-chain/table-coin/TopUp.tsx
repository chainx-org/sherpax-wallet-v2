import React, {useRef} from 'react'
import {ITable} from "@polkadot/react-components";
import {useTranslation} from "@polkadot/app-explorer/translate"
import useToTop from '@polkadot/react-hooks/useToTop'
import {IDataItem} from "@polkadot/react-hooks/useWithdrawals";
import sBtc_svg from "@polkadot/app-explorer/svg/sBTC.svg";


interface Props  {}

const TopUp = (props: Props) => {
  const { t } = useTranslation();
  const toTop = useToTop()

  const header = useRef([
    //text class colspan
    [t('Top Up'),''],
  ]);

  return (
    <div className="top-up">
      <ITable header={header.current} empty={'No latest cross-chain asset top up' } className="top-up-table">
        {toTop.map((item:IDataItem) => {
          return (
            <tr key={item.extrinsicHash}>
              <td>
                <img src={item.assetId === 1 ? sBtc_svg : sBtc_svg} alt="coin-logo" />
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

export default  TopUp
