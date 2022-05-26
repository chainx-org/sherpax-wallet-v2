// Copyright 2017-2022 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '@polkadot/react-query/types';
import styled  from "styled-components";

import React, { useContext, useMemo, useRef } from 'react';
import { useApi } from '@polkadot/react-hooks';
import InterChain from './components/inter-chain'
import { BlockAuthorsContext, EventsContext } from '@polkadot/react-query';


import { useTranslation } from './translate';

interface Props {
  basePath: string;
  className?: string;
  newEvents?: KeyedEvent[];
}

function ExplorerApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { lastHeaders } = useContext(BlockAuthorsContext);
  const { eventCount, events } = useContext(EventsContext);


  return (
    <main className={className}>
      <InterChain />
    </main>
  );
}

export default React.memo(styled(ExplorerApp) `
  .inter-chain {
    padding: 26px;
    .table-coin {
      display: grid;
      grid-template-columns: repeat(2,1fr);
      gap: 20px;
      //display: flex;
      //flex-wrap: wrap;
      margin-top: 30px;
      .top-up-table {
        margin-bottom: 20px;
      }
      .top-up-table,
      .withdrawals-table,
      .transfer-table {
        table {
          tr {
            td {
              &:first-child {
                flex: 1;
                justify-content: start;
                margin-left: 25px;
              }
              &:last-child {
                text-align: left;
                margin-right: 25px;
                max-width: 300px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
      }
    }
    .coin-panel {
      .coin-card{
        padding: 24px 26px;
        background: #FFFFFF;
        border-radius: 2px;
        border: 1px solid #DCE0E2;
        .card-btns {
          font-family: 'NotoSansSC-Bold, NotoSansSC  serif';
          display: flex;
          color: rgb(130, 128, 129);
          font-weight: 600;
          justify-content: space-between;
          align-items: center;
          .coin-logo {
            display: flex;
            align-items: center;
            font-size: 16px;
            img {
              width: 32px;
              height: 32px;
              margin-right: 8px;
            }
          }
          .btns {
          }
          a {
            color: #4E4E4E;
          }
        }
      }
      .assets-view {
        margin-top: 40px;
        display: flex;
        justify-content: start;
        align-items: end;
        > div {
          margin-right: 80px;
          &:nth-child(2) {
            margin-right: 110px;
          }
          &:last-child {
            margin: 0;
          }
          h2 {
            margin: 0;
            font-size: 16px;
            font-weight: 500;
            color: #4E4E4E;
            height: 33px;
            line-height: 33px;
            &.balance-tit {
              font-size: 24px;
              font-weight: 600;
              color: #4E4E4E;
              .dollar {
                font-size: 18px;
              }
            }

          }
          p {
            font-weight: 400;
            margin-bottom: 9px;
            height: 16px;
            font-size: 16px;
            color: rgba(78, 78, 78, .8);
            line-height: 16px;
          }
        }
      }
    }
  }

`)
