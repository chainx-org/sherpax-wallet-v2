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
      display: flex;
      margin-top: 30px;
      .top-up-table,
      .withdrawals-table {
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
      .top-up {
        flex: 1;
        margin-right: 20px;
      }
      .withdrawals {
        flex: 1;
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
          a {
            color: #4E4E4E;
          }
        }
      }
    }
  }

`)
