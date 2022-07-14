import React from 'react'
import {ITable} from "@polkadot/react-components";
import {IDataItem} from "@polkadot/react-hooks/useWithdrawalsAndTransfer";
import sBtc_svg from "@polkadot/app-explorer/svg/sBTC.svg";
import doge_svg from "@polkadot/app-explorer/svg/dog.png"
import { settings } from '@polkadot/ui-settings';


interface Props  {
  header:any,
  source:IDataItem[]
  className:string,
  empty:string,
}

const TableData = ({header,source,className,empty}: Props) => {

  return (
    <div className={className}>
      <ITable header={header.current} empty={empty} className={`${className}-table`} >
        {source.map((item:IDataItem) => {
          return (
            <tr key={item.extrinsicHash}>
              <td>
                <img src={item.assetId === 1 ? sBtc_svg : doge_svg} alt="coin-logo" />
                {item.balance}
              </td>
              <td> <a href={`https://scan${settings.apiUrl.includes('test') ? '-pre' : ''}.sherpax.io/trade/${item.extrinsicHash}`} target="_blank">{item.shortHashAddrs}</a> </td>
              <td>{item.blockTimestamp}</td>
            </tr>
          )
        })}
      </ITable>
    </div>
  )
}

export default  TableData
