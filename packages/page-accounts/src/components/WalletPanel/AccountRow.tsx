// [object Object]
// SPDX-License-Identifier: Apache-2.0

import React, {useContext, useEffect} from 'react';

import Transfer from '@polkadot/app-accounts/modals/Transfer';
import TransferX from '@polkadot/app-accounts-chainx/modals/Transfer';
import { useTranslation } from '@polkadot/app-accounts/translate';
import Candidate from '@polkadot/app-council/Overview/Candidate';
import { Button } from '@polkadot/react-components';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import AccountActions from '@polkadot/react-components-chainx/AccountStatus/AccountActions';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

interface Props {
  dataState?: any
}

const AccountRow = ({ dataState }: Props) => {
  const { n, stateN } = dataState;
  const isComingWallet = (window as any)?.web3?.currentProvider?.isComingWallet || (window as any)?.web3?.currentProvider?.isTrust
  const { currentAccount } = useContext(AccountContext);
  const [isTransferOpen, toggleTransfer] = useToggle();
  const api = useApi();
  const { t } = useTranslation();

  const accountActionData = {
    address: currentAccount
  };

  useEffect(() => alert('测试3'),[])

  return (
    <div className='accountRow'>
      <Candidate
        ShortAddressStyle={{ fontSize: '16px', color: '#353D41', lineHeight: '22px' }}
        accountNameStyle={{ fontSize: '18px', color: '#353D41', lineHeight: '25px', marginBottom: '5px' }}
        address={currentAccount}
        iconSize={28}
        withShortAddress={true}
      >
      </Candidate>
      {isTransferOpen && (
        !isComingWallet ?
        <Transfer
          key='modal-transfer'
          onClose={toggleTransfer}
          senderId={currentAccount}
          successCB={() => stateN(Math.random())}
        /> :
          <TransferX
            key='modal-transfer'
            onClose={toggleTransfer}
            senderId={currentAccount}
            setN={stateN}
          />
      )}
      <div className='send'>
        {isFunction(api.api.tx.balances?.transfer) && (
          <Button
            className='send-button'
            icon='paper-plane'
            label={t<string>('send')}
            onClick={toggleTransfer}
          />
        )}
        <div
          className='point'
          style={{ marginLeft: '20px' }}
        >
          <AccountActions account={accountActionData}></AccountActions>
        </div>
      </div>
    </div>
  );
};

export default AccountRow;
