// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';
import styled from 'styled-components';

// eslint-disable-next-line @typescript-eslint/no-var-requires

function NodeInfo ({ className = '' }: Props): React.ReactElement<Props> {
  return (
    <div
      className={`${className} media--1400 highlight--color-contrast`}
      id='media--1400'
    >
      1111
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
