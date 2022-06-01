// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';
import styled from 'styled-components';

import AssetsTable from '../components/AssetsTable';
import Transactions from '../components/Transactions';
import WallerPanel from '../components/WalletPanel';

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
  font-family: 'PingFangSC-Medium, PingFang SC,serif';
  .walletPanel {
    display:flex;
    justify-content: space-between;

    .left {
      position: relative;
      flex:1;
      margin-right:20px;
      border-radius: 6px;
      //overflow: hidden;
      .point {
        /* cursor:pointer ; */
        padding: 8px;
        &:hover {
          background: #6098ff;
          color: white;
        }
      }
      .details {
        >div:last-child {
          padding-right: 40px;
        }
      }

      .left-wrapper {
        position: relative;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        box-sizing:border-box;
        padding:30px 33px ;
        height: 290px;
        background: linear-gradient(135deg, #CBE5FF 0%, #83AFFF 100%);
        border: 1px solid #DCE0E2;
        > img {
          position: absolute;
          transition: all .5s;
          right: 0;
          bottom: 0;
        }
        img.down {
          &.click {
            transform: rotate(180deg);
          }
          cursor: pointer;
          z-index: 1;
          right: 40px;
          bottom: 30px;
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
      .down-lock {
        display: none;
        position: relative;
        z-index: 9;
        border: 2px solid;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        border-image: linear-gradient(270deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.3)) 2 2;
        width: 100%;
        height: 88px;
        background: linear-gradient(135deg, #8fbcff 0%, #6a9fff 100%);
        backdrop-filter: blur(10px);
        &.show-down {
          display: block;
          //transform: rotate(180deg);
        }
        .flex {
          display: flex;
          box-sizing: border-box;
          height: 100%;
          padding: 0 33px;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
    .right {
      font-family: inherit;
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
          svg {
            color: rgb(172, 172, 172);
          }
        }
      }
    }
  }
  .assetsTable{
    margin: 30px 0 28px 0;
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
