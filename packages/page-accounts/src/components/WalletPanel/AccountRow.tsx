import React, {useContext} from 'react'
import Candidate from "@polkadot/app-council/Overview/Candidate";
import Transfer from "@polkadot/app-accounts/modals/Transfer";
import {isFunction} from "@polkadot/util";
import {Button} from "@polkadot/react-components";
import AccountActions from "@polkadot/react-components-chainx/AccountStatus/AccountActions";
import {AccountContext} from "@polkadot/react-components-chainx/AccountProvider";
import {useApi, useToggle} from "@polkadot/react-hooks";
import {useTranslation} from "@polkadot/app-accounts/translate";

interface Props {
  dataState?:any
}

const AccountRow = ({dataState}: Props) => {
  const {n,stateN} = dataState
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
                 accountNameStyle={{fontSize:'18px',color:'#353D41',lineHeight: '25px',marginBottom:'5px'}}
      >
      </Candidate>
      {isTransferOpen && (

        <Transfer
          key='modal-transfer'
          onClose={toggleTransfer}
          senderId={currentAccount}
          successCB={() => stateN(Math.random())}
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
        <div className="point" style={{marginLeft:"20px"}}>
          <AccountActions account={accountActionData}></AccountActions>
        </div>
      </div>
    </div>
  )
}

export default AccountRow
