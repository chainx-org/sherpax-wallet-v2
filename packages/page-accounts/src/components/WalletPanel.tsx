// [object Object]
// SPDX-License-Identifier: Apache-2.0

import React, {useContext, useMemo, useState, useCallback, useEffect} from 'react';
import Candidate from '@polkadot/app-council/Overview/Candidate';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import AccountActions from '@polkadot/react-components-chainx/AccountStatus/AccountActions';
import {  Button} from '@polkadot/react-components';
import { isFunction } from '@polkadot/util';
import {useApi,useToggle,useFavorites} from '@polkadot/react-hooks'
import { useTranslation } from '../translate';
import Transfer from '../modals/Transfer';
import AssetView from '../components/AssetView'
import XZ_SVG from '../../svg/xz.svg'




type Props = {}

export default function WalletPanel ({}: Props) {
  const { currentAccount } = useContext(AccountContext);
  const [isTransferOpen, toggleTransfer] = useToggle();
  const {t} = useTranslation()

  const api = useApi();

  const accountActionData = {
    address:currentAccount
  }



  return (
    <div className='walletPanel'>
      <div className='left'>
        <div className='accountRow'>
          <Candidate address={currentAccount} withShortAddress={true}>
          </Candidate>
          {isTransferOpen && (
            <Transfer
              key='modal-transfer'
              onClose={toggleTransfer}
              senderId={currentAccount}
            />
          )}
          <div className="send">
            {isFunction(api.api.tx.balances?.transfer) && (
              <Button
                className='send-button'
                icon='paper-plane'
                label={t<string>('send')}
                onClick={toggleTransfer}
              />
            )}
            <div style={{marginLeft:"20px"}}>
              <AccountActions account={accountActionData}></AccountActions>
            </div>
          </div>
        </div>
        {/*<AssetView*/}
        {/*  key={Math.random()}*/}
        {/*  bold*/}
        {/*  title={t('Transferrable')}*/}
        {/*  value={usableBalance > 0 ? usableBalance : 0}*/}
        {/*/>*/}

        <img src={XZ_SVG} alt=""/>
      </div>
      <div className='right'></div>
    </div>
  );
}
