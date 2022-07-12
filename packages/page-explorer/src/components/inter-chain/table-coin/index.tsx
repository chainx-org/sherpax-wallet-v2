// [object Object]
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';


import { useTranslation } from '@polkadot/app-explorer/translate';

import useToTop from '@polkadot/react-hooks/useToTop';

import useWithdrawals, { useTransfer } from '@polkadot/react-hooks/useWithdrawalsAndTransfer';



import TableData from './TableData';

interface Props {}

const TableCoin = (props: Props) => {
  const { t } = useTranslation();

  const toTop = useToTop();
  const toTopHeader = useRef([
    // text class colspan
    [t('top up'), '']
  ]);

  const transfer = useTransfer();
  const transferHeader = useRef([
    [t('transfers'), '']
  ]);

  const withdrawals = useWithdrawals();
  const withdrawalsHeader = useRef([
    [t('withdrawals'), '']
  ]);

  return (
    <div className='table-coin'>
      <TableData
        className={'top-up'}
        empty={'No latest cross-chain asset top up'}
        header={toTopHeader}
        source={toTop}
      />
      <TableData
        className={'withdrawals'}
        empty={'No latest cross-chain asset withdrawals'}
        header={withdrawalsHeader}
        source={withdrawals}
      />
      <TableData
        className={'transfer'}
        empty={'No latest cross-chain asset transfers'}
        header={transferHeader}
        source={transfer}
      />
    </div>
  );
};

export default TableCoin;
