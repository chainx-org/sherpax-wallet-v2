import React, {useContext} from 'react'
import ITable from '@polkadot/react-components/ITable'
import {AccountContext} from "@polkadot/react-components-chainx/AccountProvider";

interface Props  {
  transfersDataCross:any
}

interface ITransFersCross {
  assetId: number;
  fromAccountId: string;
  toAccountId: string;
  balance: string;
  blockNum: number;
  blockTime:string,
  logoUrl:string,
  moduleId: string;
  eventId: string;
  extrinsicHash: string;
  blockTimestamp: number;
  transferHash:string
}



const TransfersCrossTable = ({transfersDataCross}: Props) => {
  const { currentAccount } = useContext(AccountContext);

  return (
    <div className="transfersCrossTable">
      <ITable className="transfer" empty="No latest cross-chain asset transactions">
        {
          transfersDataCross.map((item:ITransFersCross) => {
            return (
              <tr key={item.blockTimestamp}>
                <td>
                  <img src={item.logoUrl} alt="cross_coin"/>
                  {item.balance}
                </td>
                <td>
                  <a href={`https://scan.sherpax.io/trade/${item.extrinsicHash}`} target="_blank">
                    {item.transferHash}
                  </a>
                </td>
                <td>
                  {item.fromAccountId === currentAccount ? 'Out' : 'In'}
                </td>
                <td>{item.blockTime}</td>
              </tr>
            )
          })
        }
      </ITable>
    </div>
  )
}

export default  TransfersCrossTable
