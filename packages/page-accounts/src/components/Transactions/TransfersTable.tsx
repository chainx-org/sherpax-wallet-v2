import React, {useContext} from 'react'
import ITable from '@polkadot/react-components/ITable'
import KSX_SVG from '../../../svg/ksx.svg'
import {AccountContext} from "@polkadot/react-components-chainx/AccountProvider";
import { settings } from '@polkadot/ui-settings';


interface Props  {
  transfersData: TransferItem[]
}
interface TransferItem {
  extrinsicHash: string;
  blockHeight: number;
  blockTime: number;
  from: string;
  to: string;
  balance: string;
  extrinsic_idx: number;
  success: boolean;
  transferHash:string
}

const TransfersTable = ({transfersData}: Props) => {
  const { currentAccount } = useContext(AccountContext);

  return (
    <div className="transfersTable">
      <ITable className="transfer" empty="No latest asset transactions" >
        {
          transfersData.map((item:TransferItem) => {
            return (
              <tr key={item.extrinsicHash}>
                <td> <img src={KSX_SVG} alt="ksx"/> {item.balance} </td>
                <td><a href={`https://scan${settings.apiUrl.includes('test') ? '-pre' : ''}.sherpax.io/trade/${item.extrinsicHash}`} target="_blank">{item.transferHash}</a> </td>
                <td> {item.from === currentAccount ? 'Out' : 'In'} </td>
                <td> {item.blockTime} </td>
              </tr>
            )
          })
        }
      </ITable>
    </div>
  )
}

export default  TransfersTable
