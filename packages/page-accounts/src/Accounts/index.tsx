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
      height: 290px;
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
        margin-bottom: 36px;
        .send {
          display: flex;
          align-items: center;
        }
      }
      .balance {
        .details {
          display: flex;
          justify-content: space-between;
          position: relative;
          margin-top: 31px;
          z-index: 1;
        }
      }
    }
    .right {
      flex:1 ;
      box-sizing: border-box;
      padding: 16px 26px;
      height: 290px;
      background: #FFFFFF;
      border-radius: 4px;
      border: 1px solid #DCE0E2;
      .estimated {
        font-family: 'PingFangSC-Medium, PingFang SC,serif';
        .estimated-tit {
          font-size: 16px;
          font-family: inherit;
          font-weight: 500;
          color: #4E4E4E;
          line-height: 22px;
          margin-bottom: 4px;
        }
        .btc-balance {
          height: 37px;
          font-size: 20px;
          font-family: 'PingFangSC-Regular, PingFang SC,serif';
          font-weight: 400;
          color: #4E4E4E;
          line-height: 28px;
          padding-bottom: 9px;
          border-bottom:  1px solid #DCE0E2;
        }
      }
    }
  }

`);
