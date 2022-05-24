import React, { useContext,useCallback} from 'react'
import useSbtcAssets from '@polkadot/react-hooks/useSbtcAssets'
import {AccountContext} from "@polkadot/react-components-chainx/AccountProvider";
import {CoinPriceContext} from "@polkadot/react-components-chainx/CoinPriceProvider";

interface Props  {}

const AssetsView = (props: Props) => {
  const { currentAccount } = useContext(AccountContext);
  const {coinExchangeRate,btcDollar} = useContext(CoinPriceContext)

  const [{price}] = coinExchangeRate.filter((item:any ) => item.coin === 'sBTC')
  

  const sbtcAssets = useSbtcAssets(currentAccount)

  return (
    <div className="assets-view">
      <div className="balance">
        <p >Balance</p>
        <h2 className="balance-tit" >{sbtcAssets.balance} sBTC <span className="dollar"> (≈ ${Number(price * sbtcAssets.balance ).toFixed(2)}) </span> </h2>
      </div>
      <div className="transferable">
        <p>Transferable</p>
        <h2>{sbtcAssets.balance - sbtcAssets.reserved} sBTC</h2>
      </div>
      <div className="reserved">
        <p>Withdrawal Reserved</p>
        <h2>{sbtcAssets.reserved} sBTC</h2>
      </div>
    </div>
  )
}

export default  React.memo(AssetsView)
