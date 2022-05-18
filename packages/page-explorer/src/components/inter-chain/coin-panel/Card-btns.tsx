import React, {useContext,useState} from 'react'
import { Button } from '@polkadot/react-components'
import Sbtc_svg from '../../../svg/sBTC.svg'
import {useTranslation} from "@polkadot/app-explorer/translate";
import Withdraw from '@polkadot/app-accounts-chainx/modals/withdraw'
import Deposite from '@polkadot/app-accounts-chainx/modals/deposite2'
import {isFunction} from "@polkadot/util";
import Transfer from "@polkadot/app-assets/Balances/TransferSbtc";
import {useApi,useToggle,useAccounts} from "@polkadot/react-hooks";
import {AccountContext} from "@polkadot/react-components-chainx/AccountProvider";
import useSbtcAssets from '@polkadot/app-accounts-chainx/Myview/useSbtcAssets';



interface Props  {}

const CardBtns = (props: Props) => {
  const { currentAccount } = useContext(AccountContext);
  const [n, setN] = useState(0);
  const {isApiReady} = useApi();
  const {hasAccounts, allAccounts} = useAccounts()
  const hasCurrentName = allAccounts.find(account => account === currentAccount)

  const { t } = useTranslation();
  const api = useApi();
  const [isWithdraw, toggleWithdraw] = useToggle();
  const [isDepositeOpen, toggleDeposite] = useToggle();
  const currentAccountInfo = useSbtcAssets(currentAccount, n)



  return (
    <div className="card-btns">
      {isWithdraw && (
        <Withdraw
          account={currentAccount}
          btc={currentAccountInfo?.balance}
          onClose={toggleWithdraw}
          setN={setN}
        />
      )
      }
      {isDepositeOpen && (
        <Deposite
          address={currentAccount}
          onClose={toggleDeposite}
        />
      )
      }
      <div className="coin-logo">
        <img src={Sbtc_svg} alt="sbtc-logo"/>
        sBTC
      </div>
      <div className="btns">
        <Button icon={'arrow-down'} label={t<string>('Top Up')}
                isDisabled={!isApiReady || !currentAccount || !hasAccounts || !hasCurrentName}
                onClick={toggleDeposite}
        ></Button>
        <Button icon={'arrow-up'} label={t<string>('Withdrawals')}  onClick={toggleWithdraw}
        ></Button>
        {isFunction(api.api.tx.balances?.transfer) && (
          <Transfer
            className="send-28"
            key='modal-transfer card-btns'
            // onClose={toggleTransfer}
            accountId={currentAccount}
            assetId={1}
            siFormat={[8,'SBTC']}
          />
        )}
        <a href="https://soswap.finance" target="_blank">
          <Button className="send-button" icon={'arrow-right-arrow-left'} label={t<string>('Swap')}></Button>
        </a>
      </div>
    </div>
  )
}

export default  CardBtns
