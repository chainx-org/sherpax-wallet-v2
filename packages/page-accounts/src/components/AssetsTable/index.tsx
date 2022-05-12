import React, {useContext, useRef} from 'react'
import {Button, Table} from '@polkadot/react-components'
import {useTranslation} from '@polkadot/app-accounts-chainx/translate'
import useAssetsBalance from '@polkadot/react-hooks/useAssetsBalance'
import {isFunction} from "@polkadot/util";
import {useApi, useToggle} from "@polkadot/react-hooks";
import Transfer from "@polkadot/app-accounts/modals/Transfer";
import {AccountContext} from "@polkadot/react-components-chainx/AccountProvider";

interface Props  {}

const AssetsTable = (props: Props) => {
  const { t } = useTranslation();

  const header = useRef([
    //text class colspan
    [t('Cross-chain Assets'),''],
    [t('Token')],
    [t('Balance'), 'media--1500'],
    [t('Value'), 'value'],
    [t('')],
  ]);

  const [totalBalance,estimated] = useAssetsBalance()
  console.log(totalBalance,estimated,`-432423`)
  const api = useApi();
  const { currentAccount } = useContext(AccountContext);
  const [isTransferOpen, toggleTransfer] = useToggle();

  return (
    <div className="assetsTable">
      {isTransferOpen && (

        <Transfer
          key='modal-transfer'
          onClose={toggleTransfer}
          senderId={currentAccount}
        />
      )}
      <Table header={header.current} >
        {totalBalance.map(((item,index) => {
          return (
            <tr key={index}>
              <td><img src={item.logo} alt="coin" /> <span style={{textAlign:"left",width:'20px'}}>{item.coin} </span> </td>
              <td>{item.coinNum.toFixed(4)} {item.coin} </td>
              <td>≈ $ {item.dollar.toFixed(2).toLocaleString()}</td>
              <td>

                {isFunction(api.api.tx.balances?.transfer) && (
                  <Button
                    className='send-button mar15'
                    icon='paper-plane'
                    label={t<string>('send')}
                    onClick={toggleTransfer}
                  />
                )}
                <Button
                  className='send-button'
                  icon='paper-plane'
                  label={t<string>('Swap')}
                  onClick={toggleTransfer}
                />
              </td>
            </tr>
          )
        }))}
      </Table>
    </div>
  )
}

export default  AssetsTable
