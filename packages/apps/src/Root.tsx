// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeDef } from '@polkadot/react-components/types';
import type { KeyringStore } from '@polkadot/ui-keyring/types';

import React, { Suspense, useEffect, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { Api } from '@polkadot/react-api';
import Queue from '@polkadot/react-components/Status/Queue';
import {Web3ReactProvider} from '@web3-react/core'
import {getLibrary} from './Web3Library'


import { AccountProvider } from '@polkadot/react-components-chainx/AccountProvider';
import {TokenListProvider} from '@polkadot/react-components-chainx/TokenListProvider';
import {KSXBalanceProvider} from '@polkadot/react-components-chainx/KSXBalanceProvider';
import {CoinPriceProvider} from '@polkadot/react-components-chainx/CoinPriceProvider'
import {BubbleProvider} from '@polkadot/react-components-chainx/BubbleProvider'
import { BlockAuthors, Events } from '@polkadot/react-query';
import { settings } from '@polkadot/ui-settings';

import Apps from './Apps';
import { darkTheme, lightTheme } from './themes';
import WindowDimensions from './WindowDimensions';

interface Props {
  isElectron: boolean;
  store?: KeyringStore;
}

function createTheme ({ uiTheme }: { uiTheme: string }): ThemeDef {
  const validTheme = uiTheme === 'dark' ? 'dark' : 'light';

  document && document.documentElement &&
    document.documentElement.setAttribute('data-theme', validTheme);

  return uiTheme === 'dark'
    ? darkTheme
    : lightTheme;
}

function Root ({ isElectron, store }: Props): React.ReactElement<Props> {
  const [theme, setTheme] = useState(() => createTheme(settings));

  useEffect((): void => {
    settings.on('change', (settings) => setTheme(createTheme(settings)));
  }, []);

  return (
    <Suspense fallback='...'>
      <ThemeProvider theme={theme}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <TokenListProvider>
            <AccountProvider>
              <Queue>
                <Api
                  apiUrl={settings.apiUrl}
                  isElectron={isElectron}
                  store={store}
                >
                  <BlockAuthors>
                    <Events>
                      <HashRouter>
                        <WindowDimensions>
                          <KSXBalanceProvider>
                            <CoinPriceProvider>
                              <BubbleProvider>
                                <Apps />
                              </BubbleProvider>
                            </CoinPriceProvider>
                          </KSXBalanceProvider>
                        </WindowDimensions>
                      </HashRouter>
                    </Events>
                  </BlockAuthors>
                </Api>
              </Queue>
            </AccountProvider>
          </TokenListProvider>
        </Web3ReactProvider>


      </ThemeProvider>
    </Suspense>
  );
}

export default React.memo(Root);
