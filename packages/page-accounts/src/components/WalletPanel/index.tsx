// [object Object]
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import XZ_SVG from '../../../svg/xz.svg'
import AccountRow from './AccountRow'
import Balance from './Balance'
import BalanceChart from './BalanceChart'



interface PcxCardProps {
  lookup?: any
}


export default function Index ({lookup = ''}: PcxCardProps) {
  return (
    <div className='walletPanel'>
      <div className='left'>
        <AccountRow />
        <Balance lookup={lookup} />
        <img src={XZ_SVG} alt="sherpax_logo"/>
      </div>
      <div className='right'>
        <BalanceChart />
      </div>
    </div>
  );
}
