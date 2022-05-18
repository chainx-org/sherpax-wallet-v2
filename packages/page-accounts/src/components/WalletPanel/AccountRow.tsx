import React, {useContext} from 'react'
import Candidate from "@polkadot/app-council/Overview/Candidate";
import Transfer from "@polkadot/app-accounts/modals/Transfer";
import {isFunction} from "@polkadot/util";
import {Button} from "@polkadot/react-components";
import AccountActions from "@polkadot/react-components-chainx/AccountStatus/AccountActions";
import {AccountContext} from "@polkadot/react-components-chainx/AccountProvider";
import {useApi, useToggle} from "@polkadot/react-hooks";
import {useTranslation} from "@polkadot/app-accounts/translate";

interface Props {}

const AccountRow = (props: Props) => {
  const { currentAccount } = useContext(AccountContext);
  const [isTransferOpen, toggleTransfer] = useToggle();
  const api = useApi();
  const {t} = useTranslation()


  const accountActionData = {
    address:currentAccount
  }

  return (
    <div className='accountRow'>
      <Candidate address={currentAccount} withShortAddress={true} iconSize={28}
                 ShortAddressStyle={{fontSize:'16px',color:'#353D41',lineHeight: '22px'}}
                 accountNameStyle={{fontSize:'18px',color:'#353D41',lineHeight: '25px',marginBottom:'5px','fontFamily': 'PingFangSC-Regular, PingFang SC'}}
      >
      </Candidate>
      {isTransferOpen && (

        <Transfer
          key='modal-transfer'
          onClose={toggleTransfer}
          senderId={currentAccount}
        />
      )}
      <div className="send">
        {isFunction(api.api.tx.balances?.transfer) && (
          <Button
            className='send-button'
            icon='paper-plane'
            label={t<string>('send')}
            onClick={toggleTransfer}
          />
        )}
        <div style={{marginLeft:"20px"}}>
          <AccountActions account={accountActionData}></AccountActions>
        </div>
      </div>
    </div>
  )
}

export default AccountRow