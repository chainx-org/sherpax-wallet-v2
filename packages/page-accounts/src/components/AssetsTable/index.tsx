import React, {useContext, useRef,useState} from 'react'
import {Button, ITable} from '@polkadot/react-components'
import {useTranslation} from '@polkadot/app-accounts-chainx/translate'
import useAssetsBalance,{ICurrentBalance} from '@polkadot/react-hooks/useAssetsBalance'
import {isFunction} from "@polkadot/util";
import {useApi, useToggle} from "@polkadot/react-hooks";
import Transfer from '@polkadot/app-assets/Balances/Transfer'
import {AccountContext} from "@polkadot/react-components-chainx/AccountProvider";
import KSX_SVG from '../../../svg/ksx.svg'


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
  const api = useApi();
  const { currentAccount } = useContext(AccountContext);
  // 获取的余额
  // const balances = useBalances(info?.id);

  return (
    <div className="assetsTable">
      <ITable header={header.current} >
        {totalBalance.map(((item,index) => {
          return (
            item.coin !== 'KSX' && <tr key={index}>
              {/*<td> <img src={ item.coin === 'KSX' ? KSX_SVG : item.logo} alt="coin"/> <span style={{textAlign:"left",width:'20px'}}>{item.coin} </span> </td>*/}
              <td> <img src={item.logo} alt="coin"/> <span style={{textAlign:"left",width:'20px'}}>{item.coin} </span> </td>
              <td>{item.coinNum.toFixed(4)} {item.coin} </td>
              <td>≈ $ {item.dollar.toFixed(2).toLocaleString()}</td>
              <td>
                {isFunction(api.api.tx.balances?.transfer) && (
                  <Transfer
                    key='modal-transfer'
                    // onClose={toggleTransfer}
                    accountId={currentAccount}
                    assetId={item.assetId}
                    siFormat={[item.decimals,item.coin]}
                  />
                )}
                <a href="https://soswap.finance" target="_blank" style={{color:'rgba(78, 78, 78, 1)'}} >
                  <Button
                    className='send-button send-24'
                    icon='arrow-right-arrow-left'
                    label={t<string>('Swap')}
                  />
                </a>
              </td>
            </tr>
          )
        }))}
      </ITable>
    </div>
  )
}

export default  AssetsTable
