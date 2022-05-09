// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { Delegation } from '@polkadot/app-accounts-chainx/types';
import { AddressSmall, Balance, Button } from '@polkadot/react-components';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import AccountActions from '@polkadot/react-components-chainx/AccountStatus/AccountActions';
import { useApi, useCall } from '@polkadot/react-hooks';
import { ProxyDefinition } from '@polkadot/types/interfaces';
import { KeyringAddress } from '@polkadot/ui-keyring/types';

import { useTranslation } from '../translate';

function noop () { }

interface Props {
  address: string;
  className?: string;
  isFavorite: boolean;
  toggleFavorite: (address: string) => void;
  setStoredValue: string | ((value: string) => void) | undefined;
  isAccountChecked: boolean;
  account: KeyringAddress;
  delegation?: Delegation;
  proxy?: [ProxyDefinition[], BN];
  isValid?: boolean;
  isContract?: boolean;
}

function Account ({ account, address, className, delegation, isAccountChecked, isContract, isValid: propsIsValid, proxy, setStoredValue }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { changeAccount } = useContext(AccountContext);
  const { api } = useApi();
  const allBalances = useCall<DeriveBalancesAll>(api.derive.balances.all, [address]);

  return (
    <tr className={className}>
      <td>
        <AddressSmall
          value={address}
        />
      </td>
      <td className='middle'>
        <Balance
          balance={allBalances?.freeBalance.sub(allBalances?.frozenMisc)}
          className='accountBox--all'
          label={t('balances')}
          params={address}
        />

      </td>
      <td className='number middle samewidth'>
        {isAccountChecked
          ? <Button
            icon={'check'}
            label={''}
            onClick={noop}
            >
          </Button>
          : <Button
            icon={'plus'}
            isBasic={true}
            label={t('Change')}
            onClick={() => {
              setStoredValue(address);
              changeAccount(address);
            }}
            />}
      </td>
      <td>
        <AccountActions
          account={account}
          delegation={delegation}
          isContract={isContract}
          propsIsValid={propsIsValid}
          proxy={proxy}
        />
      </td>

    </tr>
  );
}

export default styled(Account)`

  td {
    padding: 0.75rem !important;
  }
  .middle {
    .accountBox--all {
      @media only screen and (max-width: 520px) {
        display: none;
      }
    }
  }
  .accounts--Account-buttons {
    text-align: right;
  }

  .tags--toggle {
    cursor: pointer;
    width: 100%;
    min-height: 1.5rem;

    label {
      cursor: pointer;
    }
  }

  .name--input {
    width: 16rem;
  }

  .samewidth button:first-child {
    min-width: 6.5rem;
    @media only screen and (max-width: 540px) {
      min-width: 0.5rem;
    }
  }
`;
