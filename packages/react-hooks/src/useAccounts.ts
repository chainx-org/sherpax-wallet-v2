// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import { useEffect, useState,useContext } from 'react';
import { AccountContext } from '../../react-components-chainx/src/AccountProvider';


import { keyring } from '@polkadot/ui-keyring';
import { useApi } from '@polkadot/react-hooks'
import { u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import { createNamedHook } from './createNamedHook';
import { useIsMountedRef } from './useIsMountedRef';

export interface UseAccounts {
  allAccounts: string[];
  allAccountsHex: string[];
  areAccountsLoaded: boolean
  hasAccounts: boolean;
  isAccount: (address?: string) => boolean;
}

const EMPTY: UseAccounts = { allAccounts: [], allAccountsHex: [], areAccountsLoaded: false, hasAccounts: false, isAccount: () => false };

function extractAccounts (accounts: SubjectInfo = {}): UseAccounts {
  const allAccounts = Object.keys(accounts);
  const allAccountsHex = allAccounts.map((a) => u8aToHex(decodeAddress(a)));
  const hasAccounts = allAccounts.length !== 0;
  const isAccount = (address?: string | null) => !!address && allAccounts.includes(address);

  return { allAccounts, allAccountsHex, areAccountsLoaded: true, hasAccounts, isAccount };
}

function useAccountsImpl (): UseAccounts {
  const mountedRef = useIsMountedRef();
  const {isApiReady} = useApi();

  const [state, setState] = useState<UseAccounts>(EMPTY);
  const { changeAccount } = useContext(AccountContext);


  useEffect((): () => void => {
    const subscription = keyring.accounts.subject.subscribe((accounts = {}) =>
      mountedRef.current && setState(extractAccounts(accounts))
    );

    return (): void => {
      setTimeout(() => subscription.unsubscribe(), 0);
    };
  }, [mountedRef]);

  useEffect(() => {
    if (
      (window as any).web3 &&
      (window as any).web3.currentProvider &&
      (window as any).web3.currentProvider.isComingWallet &&
      (window as any).web3.comingUserInfo && isApiReady
    ) {
      const account = JSON.parse((window as any).web3.comingUserInfo).address
      const name = JSON.parse((window as any).web3.comingUserInfo).name
      // const publicKey = keyring.decodeAddress(account)
      // const encodedAddress = keyring.encodeAddress(publicKey, 44)
      changeAccount(account)
      setState(
        {allAccounts:[account],hasAccounts: [account].length !== 0, isAccount:(address: string): boolean => [account].includes(address)}
      );
    }
  }, [
    (window as any).web3 &&
    (window as any).web3.currentProvider &&
    (window as any).web3.currentProvider.isComingWallet && isApiReady
  ])

  return state;
}

export const useAccounts = createNamedHook('useAccounts', useAccountsImpl);
