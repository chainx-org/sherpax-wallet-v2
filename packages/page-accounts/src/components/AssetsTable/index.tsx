// [object Object]
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useRef, useState } from 'react';

import { useTranslation } from '@polkadot/app-accounts-chainx/translate';
import Transfer from '@polkadot/app-assets/Balances/Transfer';
import { Button, ITable } from '@polkadot/react-components';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import { useApi, useToggle } from '@polkadot/react-hooks';
import useAssetsBalance, { ICurrentBalance } from '@polkadot/react-hooks/useAssetsBalance';
import { isFunction } from '@polkadot/util';

interface Props {}

const AssetsTable = (props: Props) => {
  const { t } = useTranslation();

  const header = useRef([
    // text class colspan
    [t('cross-chain assets'), ''],
    [t('Token')],
    [t('Balance'), ''],
    [t('Value'), 'value'],
    [t('')]
  ]);

  const [state, setState] = useState(0);

  const [totalBalance, estimated] = useAssetsBalance(state);
  const api = useApi();
  const { currentAccount } = useContext(AccountContext);
  // 获取的余额
  // const balances = useBalances(info?.id);

  return (
    <div className='assetsTable'>
      <ITable header={header.current}>
        {totalBalance.map((item, index) => {
          return (
            item.coin !== 'KSX' && <tr key={index}>
              {/* <td> <img src={ item.coin === 'KSX' ? KSX_SVG : item.logo} alt="coin"/> <span style={{textAlign:"left",width:'20px'}}>{item.coin} </span> </td> */}
              <td> <img
                alt='coin'
                src={item.logo}
              /> <span style={{ textAlign: 'left', width: '20px' }}>{item.coin} </span> </td>
              <td>{item.coinNum.toFixed(4)} <span className='right'>{item.coin}</span> </td>
              <td>≈ $ {item.dollar.toFixed(2).toLocaleString()}</td>
              <td>
                {isFunction(api.api.tx.balances?.transfer) && (
                  <Transfer
                    accountId={currentAccount}
                    assetId={item.assetId}
                    // onClose={toggleTransfer}
                    key='modal-transfer'
                    onSuccess={() => setState(Math.random())}
                    siFormat={[item.decimals, item.coin]}
                  />
                )}
                <a
                  href={`https://soswap.finance/#/swap?from=${item.address}`}
                  rel='noreferrer'
                  style={{ color: 'rgba(78, 78, 78, 1)' }}
                  target='_blank'
                >
                  <Button
                    className='send-button  padd16'
                    icon='arrow-right-arrow-left'
                    isReadOnly
                    label={t<string>('Swap')}
                  />
                </a>
              </td>
            </tr>
          );
        })}
      </ITable>
    </div>
  );
};

export default AssetsTable;
