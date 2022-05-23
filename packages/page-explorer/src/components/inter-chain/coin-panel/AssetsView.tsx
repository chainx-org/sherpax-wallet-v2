import React, { useContext} from 'react'
import useSbtcAssets from '@polkadot/react-hooks/useSbtcAssets'
import {AccountContext} from "@polkadot/react-components-chainx/AccountProvider";

interface Props  {}

const AssetsView = (props: Props) => {
  const { currentAccount } = useContext(AccountContext);
  const sbtcAssets = useSbtcAssets(currentAccount)
  console.log(sbtcAssets)

  return (
    <div className="assets-view">
      <div className="balance">
        <p >Balance</p>
        <h2 className="balance-tit" >{sbtcAssets.balance} sBTC</h2>
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
