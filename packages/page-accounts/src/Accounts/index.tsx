// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import WallerPanel from '../components/WalletPanel';

interface Props {
  className?: string;
}

function Wallet ({ className = '' }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <WallerPanel></WallerPanel>
    </div>
  );
}

export default React.memo(styled(Wallet)`

  .walletPanel {
    display:flex;
    justify-content: space-between;
    padding:16px 26px ;
    .left {
      position: relative;
      box-sizing:border-box;
      padding:30px 33px ;
      width: 55.156vw;
      height: 22.656vw;
      margin-right:20px ;
      background: linear-gradient(135deg, #CBE5FF 0%, #83AFFF 100%);
      border: 1px solid #DCE0E2;
      border-radius: 4px;
      > img {
        position: absolute;
        right: 0;
        bottom: 0;
      }
      .accountRow {
        display: flex;
        width: 100%;
        justify-content:space-between;
        .send {
          display: flex;
          align-items: center;
        }
      }
    }
    .right {
      flex:1 ;
      height: 22.656vw;
      background: #FFFFFF;
      border-radius: 4px;
      border: 1px solid #DCE0E2;
    }
  }

`);
