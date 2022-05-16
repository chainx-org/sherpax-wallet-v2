// [object Object]
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import store from 'store';

import Endpoints from '@polkadot/apps/Endpoints/Network';
import getApiUrl from '@polkadot/apps/initSettings';
import AccountSelect from '@polkadot/apps/Menu/NodeInfo';
import { useTranslation } from '@polkadot/apps/translate';
import { Icon } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

function SettingNode (): React.ReactElement {
  const { t } = useTranslation();
  const [isEndpointsVisible, toggleEndpoints] = useToggle();
  const apiUrl = getApiUrl();
  const [netInfo, setNetInfo] = useState<string>('');
  const stored = store.get('settings') as Record<string, unknown> || {};

  const nodeMap: {[key: string]: string} = {
    'wss://mainnet.sherpax.io': 'SherpaX node',
    'wss://sherpax-testnet.chainx.org': t('Test Node')
  };

  useEffect(() => {
    if (Object.keys(nodeMap).includes(apiUrl)) {
      setNetInfo(nodeMap[apiUrl]);
    } else {
      setNetInfo(t('Test Node'));
    }
  }, [apiUrl, stored]);

  return (
    <>
      <ul className='right'>
        {/*<li*/}
        {/*  className='switchNode media--800'*/}
        {/*  onClick={toggleEndpoints}*/}
        {/*>*/}
        {/*  <div className='circle' />*/}
        {/*  <div className='netInfo'>{netInfo}</div>*/}
        {/*  <Icon*/}
        {/*    icon='angle-down'*/}
        {/*    size='1x'*/}
        {/*  />*/}
        {/*</li>*/}
        <li className='accountSelector'>
          <AccountSelect />
        </li>
      </ul>
      {isEndpointsVisible && (
        <Endpoints onClose={toggleEndpoints} />
      )}
    </>
  );
}

export default SettingNode;
