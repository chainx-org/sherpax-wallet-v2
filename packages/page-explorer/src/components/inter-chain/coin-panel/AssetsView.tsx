// [object Object]
// SPDX-License-Identifier: Apache-2.0

import React, {  useContext } from 'react';
import { CoinPriceContext } from '@polkadot/react-components-chainx/CoinPriceProvider';


interface Props {
  unit:string
  assetsInfo:{balance:number,reserved:number}
}

const AssetsView = ({unit,assetsInfo}: Props) => {
  const { btcDollar, coinExchangeRate } = useContext(CoinPriceContext);
  const [sBTCObj] = coinExchangeRate.filter((item: any) => item.coin === unit);

  const price = sBTCObj?.price ? sBTCObj.price : 0

  return (
    <div className='assets-view'>
      <div className='balance'>
        <p>Balance</p>
        <h2 className='balance-tit'>{assetsInfo.balance} {unit} <span className='dollar'> (≈ ${Number(price * assetsInfo.balance).toFixed(2)}) </span> </h2>
      </div>
      <div className='transferable'>
        <p>Transferable</p>
        <h2>{(assetsInfo.balance - assetsInfo.reserved).toFixed(4)} {unit} <span className='dollar small-px'> (≈ ${Number(price * (assetsInfo.balance - assetsInfo.reserved)).toFixed(2)}) </span> </h2>
      </div>
      <div className='reserved'>
        <p>Withdrawal Reserved</p>
        <h2>{assetsInfo.reserved} {unit} <span className='dollar small-px'> (≈ ${Number(price * assetsInfo.reserved).toFixed(2)}) </span> </h2>
      </div>
    </div>
  );
};

export default React.memo(AssetsView);
