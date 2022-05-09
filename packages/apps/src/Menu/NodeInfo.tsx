// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';
import styled from 'styled-components';

import CreateModal from '@polkadot/app-accounts/modals/Create';
import ImportModal from '@polkadot/app-accounts/modals/Import';
import { useTranslation } from '@polkadot/app-accounts-chainx/translate';
import { StatusContext } from '@polkadot/react-components';
import { BareProps as Props } from '@polkadot/react-components/types';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import AccountStatus from '@polkadot/react-components-chainx/AccountStatus';
import Button from '@polkadot/react-components-chainx/Button';
import { useAccounts, useApi, useIpfs, useToggle } from '@polkadot/react-hooks';
import { useLocalStorage } from '@polkadot/react-hooks-chainx';

// eslint-disable-next-line @typescript-eslint/no-var-requires

function NodeInfo ({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const { isApiReady } = useApi();
  const [, setValue] = useLocalStorage<string>('currentAccount');
  const { currentAccount } = useContext(AccountContext);
  const { queueAction } = useContext(StatusContext);
  const [isCreateOpen, toggleCreate] = useToggle();
  const [isImportOpen, toggleImport] = useToggle();

  const { isIpfs } = useIpfs();

  console.log(setValue)

  return (
    <div
      className={`${className} media--1400 highlight--color-contrast`}
      id='media--1400'
    >
      {isCreateOpen && (
        <CreateModal
          onClose={toggleCreate}
          onStatusChange={queueAction}
        />
      )}
      {isImportOpen && (
        <ImportModal
          onClose={toggleImport}
          onStatusChange={queueAction}
        />
      )}
      {isApiReady && (hasAccounts
        ? <AccountStatus
          onStatusChange={queueAction}
          setStoredValue={setValue}
          storedValue={currentAccount}
          />
        : <>
          <Button
            isDisabled={isIpfs}
            label={t<string>('Add account')}
            onClick={toggleCreate}
          />
          <Button
            isDisabled={isIpfs}
            label={t<string>('Restore JSON')}
            onClick={toggleImport}
          />
        </>
      )
      }

    </div>
  );
}

export default React.memo(styled(NodeInfo)`
  background: transparent;
  font-size: 0.9rem;
  line-height: 1.2;
  padding: 0 1.5rem 0 1rem;
  text-align: right;
  @media only screen and (max-width: 768px) {
    padding: 0;
  }
  &.media--1400 {
    @media only screen and (max-width: 1400px) {
      display: block !important;
    }
  }

  > div {
    margin-bottom: -0.125em;

    > div {
      display: inline-block;
    }
  }

  button:first-child{
    margin-right: 1.8rem;
    @media only screen and (max-width: 768px) {
      display: none;
    }
  }

`);
