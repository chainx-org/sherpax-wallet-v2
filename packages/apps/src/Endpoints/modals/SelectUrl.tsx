// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { createWsEndpoints } from '@polkadot/apps-config';

import { Dropdown, Input } from '@polkadot/react-components';
import uiSettings from '@polkadot/ui-settings';

import { useTranslation } from '../../translate';
import { createOption } from './util';

interface Props {
  className?: string;
  onChange: (url: string) => void;
}

interface StateUrl {
  isValid: boolean;
  url: string;
}

interface State extends StateUrl {
  isCustom: boolean;
}

// check the validity of the url
function isValidUrl (url: string): boolean {
  return (
    // some random length... we probably want to parse via some lib
    (url.length >= 7) &&
    // check that it starts with a valid ws identifier
    (url.startsWith('ws://') || url.startsWith('wss://'))
  );
}

// sanitize a url and check it for validity
function makeUrl (_url: string): StateUrl {
  const url = _url.trim();
  const isValid = isValidUrl(url);

  return { isValid, url };
}

// this allows us to retrieve the initial state by reading the settings and the applying
// validation on-top of the values retrieved
function getInitialState (t: (key: string) => string): State {
  const url = uiSettings.get().apiUrl;

  return {
    isCustom: createWsEndpoints(t).reduce((isCustom: boolean, { value }): boolean => {
      return isCustom && value !== url;
    }, true),
    isValid: isValidUrl(url),
    url
  };
}

function SelectUrl ({ className, onChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [info, setInfo] = useState(getInitialState(() => ''));
  const { isCustom, isValid, url } = info;
  const translatedEndpoints = useMemo(
    () => createWsEndpoints(t).map((option) => createOption(option, ['local'])).filter(item => item?.value?.includes('sherpax')),
    [t]
  );



  useEffect((): void => {
    onChange && info.isValid && onChange(info.url);
    // the issue here is that the onChange callback changes each and every render... so Houston, we have
    // a desperate issue here :(
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info]);

  const _onChangeUrl = useCallback(
    (url: string): void =>
      setInfo((info: State) => ({ ...info, ...makeUrl(url) })),
    []
  );

  const _onChangeCustom = useCallback(
    (isCustom: boolean): void => setInfo({
      ...makeUrl(
        isCustom
          ? info.url
          : (createWsEndpoints(() => '').find(({ value }) => !!value) || { value: 'ws://127.0.0.1:8087' }).value as string
      ),
      isCustom
    }),
    [info]
  );

  const help = t('Select the remote endpoint, either from the dropdown on manual entered via the custom toggle');
  const label = t('Remote node/endpoint to connect to');

  return (
    <div className={className}>
      <div className='ui--row'>{
        isCustom
          ? <Input
            defaultValue={url}
            help={help}
            isError={!isValid}
            label={label}
            onChange={_onChangeUrl}
          />
          : <Dropdown
            defaultValue={url}
            help={help}
            label={label}
            onChange={_onChangeUrl}
            options={translatedEndpoints}
          />
      }</div>
      {/* <Toggle
        className='settings--customToggle'
        defaultValue={isCustom}
        label={t('Custom Endpoint')}
        onChange={_onChangeCustom}
      /> */}
    </div>
  );
}

export default React.memo(styled(SelectUrl)`
  position: relative;

  .settings--customToggle {
    position: absolute;
    top: .5rem;
    right: 3.5rem;
  }
`);
