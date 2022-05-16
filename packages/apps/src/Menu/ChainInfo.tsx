// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RuntimeVersion } from '@polkadot/types/interfaces';

import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

import { ChainImg, Icon } from '@polkadot/react-components';
import { useApi, useCall, useIpfs, useToggle } from '@polkadot/react-hooks';
import { BestNumber, Chain } from '@polkadot/react-query';

import Endpoints from '@polkadot/apps/Endpoints/modals/Network';
import getApiUrl from "@polkadot/apps/initSettings";
import store from "store";
import {useTranslation} from "@polkadot/apps/translate";

interface Props {
  className?: string;
}

function ChainInfo ({ className }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();
  const { t } = useTranslation();

  const apiUrl = getApiUrl();
  const runtimeVersion = useCall<RuntimeVersion>(isApiReady && api.rpc.state.subscribeRuntimeVersion);
  const { ipnsChain } = useIpfs();
  const [isEndpointsVisible, toggleEndpoints] = useToggle();
  const [netInfo, setNetInfo] = useState<string>('');
  const canToggle = !ipnsChain;
  const stored = store.get('settings') as Record<string, unknown> || {};

  const nodeMap: {[key: string]: string} = {
    'wss://mainnet.sherpax.io': 'Mainnet',
    'wss://sherpax-testnet.chainx.org': 'Testnet'
  };

  useEffect(() => {
    if (Object.keys(nodeMap).includes(apiUrl)) {
      setNetInfo(nodeMap[apiUrl]);
    } else {
      setNetInfo(t('Test Node'));
    }
  }, [apiUrl, stored]);

  return (
    <div className={className}>
      <div
        className={`apps--SideBar-logo-inner${canToggle ? ' isClickable' : ''} highlight--color-contrast`}
      >
        <ChainImg />
        <div className='info media--1000'>
          <div className="net" onClick={toggleEndpoints}>
            <Chain className='chain' />
            <div className="select-net">
              <div className='circle' />
              <div className='netInfo'>{netInfo}</div>
            </div>
          </div>
          <BestNumber
            className='bestNumber'
            label='#'
          />
        </div>
      </div>
      {isEndpointsVisible && (
        <Endpoints onClose={toggleEndpoints} />
      )}
    </div>
  );
}

export default React.memo(styled(ChainInfo)`
  .net {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .select-net {
      border: 1px solid #353D41;
      border-radius: 2px;
      display: flex;
      padding: 2px 5px;
      align-items: center;
      margin-left: 5px;
      .netInfo{
        font-size: .8rem;
        text-transform: capitalize;
      }

      > div {
        &.circle{
          margin-right: 5px;
          height: 0.5em;
          width: 0.5em;
          border-radius: 50%;
          background: rgba(52, 198, 154);
        }
      }
    }
  }
  box-sizing: border-box;
  padding: 0.5rem 1rem 0.5rem 0;
  margin: 0;

  .apps--SideBar-logo-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &.isClickable {
      cursor: pointer;
    }

    img {
      height: 3rem;
      margin-right: 0.5rem;
      width: 3rem;
    }

    .ui--Icon.dropdown,
    > div.info {
      text-align: right;
      vertical-align: middle;
    }

    .ui--Icon.dropdown {
      flex: 0;
      margin: 0;
      width: 1rem;
    }

    .info {
      flex: 1;
      padding-right: 0.5rem;
      text-align: right;

      .chain {
        font-size: 1rem;
        max-width: 16rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .chain, .bestNumber {
        font-size: .9rem;
        line-height: 1.2;
        text-align: left;
      }
      .bestNumber {
        font-size: 1rem;
      }

      .runtimeVersion {
          font-size: 0.75rem;
          line-height: 1.2;
          letter-spacing: -0.01em;
      }
    }
  }
`);
