// [object Object]
// SPDX-License-Identifier: Apache-2.0

import React, {useState} from 'react';
import XZ_SVG from '../../../svg/xz.svg'
import AccountRow from './AccountRow'
import Balance from './Balance'
import BalanceChart from './BalanceChart'
import DownLock from "./DownLock";
import Down_SVG from "@polkadot/app-accounts/svg/down.svg";




interface PcxCardProps {
  lookup?: any
}


export default function Index ({lookup = ''}: PcxCardProps) {
  const [downState,setDownState] = useState(false)
  const [n,stateN] = useState(0)

  return (
    <div className='walletPanel'>
      <div className='left'>
        <div className="left-wrapper">
          <AccountRow dataState={{n,stateN}} />
          <Balance dataState={{n,stateN}} lookup={lookup} />
          <img className="sherpax_logo" src={XZ_SVG} alt="sherpax_logo"/>
          <img className={`down ${downState ? 'click' : ''}`} src={Down_SVG} onClick={() => setDownState(!downState)} alt="down"/>

        </div>
        <DownLock dataState={{n,stateN}} className={`down-lock ${downState ? 'show-down' : '' }`}>

        </DownLock>

      </div>
      <div className='right'>
        <BalanceChart />
      </div>
    </div>
  );
}
