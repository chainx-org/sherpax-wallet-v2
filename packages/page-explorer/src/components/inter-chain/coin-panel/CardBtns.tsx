// [object Object]
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';

import Deposite from '@polkadot/app-accounts-chainx/modals/deposite2';
import Withdraw from '@polkadot/app-accounts-chainx/modals/withdraw';
import useSbtcAssets from '@polkadot/app-accounts-chainx/Myview/useSbtcAssets';
import Transfer from '@polkadot/app-assets/Balances/TransferSbtc';
import { useTranslation } from '@polkadot/app-explorer/translate';
import { Button } from '@polkadot/react-components';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import Top_up_svg from '../../../svg/TopUp-svg.svg';
import Withdrawals_svg from '../../../svg/withdrawals-svg.svg';

interface Props {
  title:string,
  coinImg:string,
  assetsID:number,
  siFormat:string
  addrCoin:string
  minNum:string
}

const CardBtns = ({title,coinImg,assetsID,siFormat,addrCoin,minNum}: Props) => {
  const { currentAccount } = useContext(AccountContext);
  const [n, setN] = useState(1);
  const { isApiReady } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const hasCurrentName = allAccounts.find((account) => account === currentAccount);

  const { t } = useTranslation();
  const api = useApi();
  const [isWithdraw, toggleWithdraw] = useToggle();
  const [isDepositeOpen, toggleDeposite] = useToggle();
  const currentAccountInfo = useSbtcAssets(currentAccount, n);

  return (
    <div className='card-btns'>
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
          addrCoin={addrCoin}
          minNum={minNum}
          cointype={title}
        />
      )
      }
      <div className='coin-logo'>
        <img
          alt='sbtc-logo'
          src={coinImg}
        />
        {title}
      </div>
      <div className='btns' style={{display:"flex",alignItems:"center"}}>
        <Button
          className='send-button padd10'
          iconUrl={Top_up_svg}
          isDisabled={!isApiReady || !currentAccount || !hasAccounts || !hasCurrentName}
          label={t<string>('top up')}
          onClick={toggleDeposite}
        ></Button>
        <Button
          className='send-button padd10'
          iconUrl={Withdrawals_svg}
          isDisabled={!isApiReady || !currentAccount || !hasAccounts || !hasCurrentName}
          label={t<string>('withdrawals')}
          onClick={toggleWithdraw}
        ></Button>
        {isFunction(api.api.tx.balances?.transfer) && (
          <Transfer
            accountId={currentAccount}
            assetId={assetsID}
            // onClose={toggleTransfer}
            className='send-28 padd16'
            key='modal-transfer card-btns'
            siFormat={[8, siFormat]}
          />
        )}
        <a
          href='https://soswap.finance'
          rel='noreferrer'
          target='_blank'
        >
          <Button
            className='send-button padd16'
            icon={'arrow-right-arrow-left'}
            isReadOnly
            label={t<string>('Swap')}
          ></Button>
        </a>
      </div>
    </div>
  );
};

export default CardBtns;
