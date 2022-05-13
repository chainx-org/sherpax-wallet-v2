// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, {useContext} from 'react';
import styled from 'styled-components';

import WallerPanel from '../components/WalletPanel';
import AssetsTable from '../components/AssetsTable'
import Transactions from '../components/Transactions'

interface Props {
  className?: string;
}

function Wallet ({ className = '' }: Props): React.ReactElement<Props> {

  return (
    <div className={className}>
      <WallerPanel></WallerPanel>
      <AssetsTable></AssetsTable>
      <Transactions></Transactions>
    </div>
  );
}

export default React.memo(styled(Wallet)`
  padding:16px 26px ;
  .walletPanel {
    display:flex;
    justify-content: space-between;
    .left {
      position: relative;
      box-sizing:border-box;
      padding:30px 33px ;
      flex:1;
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
      font-family: 'PingFangSC-Medium, PingFang SC,serif';
      width:39.063vw;
      box-sizing: border-box;
      padding: 16px 26px;
      height: 290px;
      background: #FFFFFF;
      border-radius: 4px;
      border: 1px solid #DCE0E2;
      .estimated {
        font-family: inherit;
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
      .assetAllocation {
        width: 100%;
        height: 100%;
        .chart-tit {
          margin-top: 9px;
          font-size: 16px;
          font-family: inherit;
          font-weight: 500;
          color: #4E4E4E;
          line-height: 22px;
        }
      }
    }
  }
  .assetsTable{
    margin-top: 30px;
  }
  .transactions {
    .tableList {
      display: flex;
      justify-content: space-between;
      .transfersTable {
        flex: 1;
        margin-right: 20px;
      }
      .transfersCrossTable {
        flex: 1;

      }
    }
  }
`);
