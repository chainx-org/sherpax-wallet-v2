// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BareProps as Props, ThemeDef } from '@polkadot/react-components/types';

import React, { useState,useContext, useMemo,useEffect } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { getSystemColor } from '@polkadot/apps-config';

import AccountSidebar from '@polkadot/app-accounts/Sidebar';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import AccountAlert from '@polkadot/react-components-chainx/AccountAlert';
import GlobalStyle from '@polkadot/react-components/styles';
import { useApi,useAccounts } from '@polkadot/react-hooks';
import Signer from '@polkadot/react-signer';

import {useWeb3React} from '@web3-react/core'
import {Web3Provider} from '@ethersproject/providers'
import {injected} from './Web3Library'

import ConnectingOverlay from './overlays/Connecting';
import Content from './Content';
import Menu from './Menu';
import WarmUp from './WarmUp';

export const PORTAL_ID = 'portals';

function Apps ({ className = '' }: Props): React.ReactElement<Props> {
  const { theme } = useContext(ThemeContext as React.Context<ThemeDef>);
  const { isDevelopment, specName, systemChain, systemName,isApiReady } = useApi();

  const {allAccounts} = useAccounts()
  const [hasCurrentName, setHasCurrentName] = useState<boolean>(false)
  const {currentAccount} = useContext(AccountContext)
  const context = useWeb3React<Web3Provider>()
  const {connector, activate} = context
  const [activatingConnector, setActivatingConnector] = useState<any>()
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  const uiHighlight = useMemo(
    () => isDevelopment
      ? undefined
      : getSystemColor(systemChain, systemName, specName),
    [isDevelopment, specName, systemChain, systemName]
  );

  useEffect(() => {
    setHasCurrentName(!!allAccounts.find(account => account === currentAccount))
  }, [allAccounts, isApiReady, currentAccount])

  useEffect(() => {
    alert('注入开始')
    if (
      ((window as any)?.web3?.currentProvider?.isComingWallet) ||
      ((window as any)?.web3?.currentProvider?.isTrust)
    ) {
      alert('注入完成')
      setActivatingConnector(injected)
      activate(injected)
    }
  }, [(window as any)?.web3])


  return (
    <>
      <GlobalStyle uiHighlight={uiHighlight} />
      <div className={`apps--Wrapper theme--${theme} ${className}`}>
        <Menu />
        <AccountSidebar>
            <Signer>
              <Content />
            </Signer>
          <ConnectingOverlay />
          {/*{isApiReady && !hasCurrentName && <AccountAlert/>}*/}
          <div id={PORTAL_ID} />
        </AccountSidebar>
      </div>
      <WarmUp />
    </>
  );
}

export default React.memo(styled(Apps)`
  background: var(--bg-page);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .--hidden {
    display: none;
  }
`);
