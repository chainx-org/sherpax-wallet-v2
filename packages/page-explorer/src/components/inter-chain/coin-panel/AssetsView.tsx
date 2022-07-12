// [object Object]
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useContext } from 'react';

import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import { CoinPriceContext } from '@polkadot/react-components-chainx/CoinPriceProvider';
import useSbtcAssets from '@polkadot/react-hooks/useSbtcAssets';

interface Props {}

const AssetsView = (props: Props) => {
  const { currentAccount } = useContext(AccountContext);
  let { btcDollar, coinExchangeRate } = useContext(CoinPriceContext);
  let [sBTCObj] = coinExchangeRate.filter((item: any) => item.coin === 'sBTC');


  const sbtcAssets = useSbtcAssets(currentAccount);

  return (
    <div className='assets-view'>
      <div className='balance'>
        <p>Balance</p>
        <h2 className='balance-tit'>{sbtcAssets.balance} sBTC <span className='dollar'> (≈ ${Number(sBTCObj?.price * sbtcAssets.balance).toFixed(2)}) </span> </h2>
      </div>
      <div className='transferable'>
        <p>Transferable</p>
        <h2>{(sbtcAssets.balance - sbtcAssets.reserved).toFixed(4)} sBTC <span className='dollar small-px'> (≈ ${Number(sBTCObj?.price * sbtcAssets.reserved).toFixed(2)}) </span> </h2>
      </div>
      <div className='reserved'>
        <p>Withdrawal Reserved</p>
        <h2>{sbtcAssets.reserved} sBTC <span className='dollar small-px'> (≈ ${Number(sBTCObj?.price * sbtcAssets.reserved).toFixed(2)}) </span> </h2>
      </div>
    </div>
  );
};

export default React.memo(AssetsView);
