// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';

import AddressToggle from '../AddressToggle';

interface Props {
  address: string;
  filter: string;
  isHidden?: boolean;
  onSelect: (address: string,index:number) => void;
  index:number
}

function Available ({ address, filter, isHidden, onSelect,index }: Props): React.ReactElement<Props> | null {
  const _onSelect = useCallback(
    () => onSelect(address,index),
    [address, onSelect]
  );

  if (isHidden) {
    return null;
  }

  return (
    <AddressToggle
      address={address}
      filter={filter}
      noToggle
      onChange={_onSelect}
    />
  );
}

export default React.memo(Available);
