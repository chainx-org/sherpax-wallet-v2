// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { AccountInfoWithProviders, AccountInfoWithRefCount } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { checkAddress } from '@polkadot/phishing';
import { InputAddress, InputBalance, MarkError, MarkWarning, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN_HUNDRED, BN_ZERO, isFunction } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClose: () => void;
  recipientId?: string;
  senderId?: string;
  successCB?:any
}

function isRefcount (accountInfo: AccountInfoWithProviders | AccountInfoWithRefCount): accountInfo is AccountInfoWithRefCount {
  return !!(accountInfo as AccountInfoWithRefCount).refcount;
}

async function checkPhishing (_senderId: string | null, recipientId: string | null): Promise<[string | null, string | null]> {
  return [
    // not being checked atm
    // senderId
    //   ? await checkAddress(senderId)
    //   : null,
    null,
    recipientId
      ? await checkAddress(recipientId)
      : null
  ];
}

function Transfer ({ className = '', onClose, recipientId: propRecipientId, senderId: propSenderId,successCB }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [hasAvailable] = useState(true);
  const [isProtected, setIsProtected] = useState(true);
  const [isAll, setIsAll] = useState(false);
  const [[maxTransfer, noFees], setMaxTransfer] = useState<[BN | null, boolean]>([null, false]);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [[, recipientPhish], setPhishing] = useState<[string | null, string | null]>([null, null]);
  const balances = useCall<DeriveBalancesAll>(api.derive.balances?.all, [propSenderId || senderId]);
  const accountInfo = useCall<AccountInfoWithProviders | AccountInfoWithRefCount>(api.query.system.account, [propSenderId || senderId]);

  useEffect((): void => {
    const fromId = propSenderId || senderId as string;
    const toId = propRecipientId || recipientId as string;

    if (balances && balances.accountId?.eq(fromId) && fromId && toId && isFunction(api.rpc.payment?.queryInfo)) {
      setTimeout((): void => {
        try {
          api.tx.balances
            ?.transfer(toId, balances.availableBalance)
            .paymentInfo(fromId)
            .then(({ partialFee }): void => {
              const adjFee = partialFee.muln(110).div(BN_HUNDRED);
              const maxTransfer = balances.availableBalance.sub(adjFee);

              setMaxTransfer(
                maxTransfer.gt(api.consts.balances?.existentialDeposit)
                  ? [maxTransfer, false]
                  : [null, true]
              );
            })
            .catch(console.error);
        } catch (error) {
          console.error((error as Error).message);
        }
      }, 0);
    } else {
      setMaxTransfer([null, false]);
    }
  }, [api, balances, propRecipientId, propSenderId, recipientId, senderId]);

  useEffect((): void => {
    checkPhishing(propSenderId || senderId, propRecipientId || recipientId)
      .then(setPhishing)
      .catch(console.error);
  }, [propRecipientId, propSenderId, recipientId, senderId]);

  const noReference = accountInfo
    ? isRefcount(accountInfo)
      ? accountInfo.refcount.isZero()
      : accountInfo.consumers.isZero()
    : true;
  const canToggleAll = !isProtected && balances && balances.accountId?.eq(propSenderId || senderId) && maxTransfer && noReference;

  return (
    <Modal
      className='app--accounts-Modal'
      header={t<string>('Send funds')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <div className={className}>
          <Modal.Columns hint={t<string>('The transferred balance will be subtracted (along with fees) from the sender account.')}>
            <InputAddress
              defaultValue={propSenderId}
              help={t<string>('The account you will send funds from.')}
              isDisabled={!!propSenderId}
              label={t<string>('send from account')}
              labelExtra={
                <Available
                  label={t<string>('transferrable')}
                  params={propSenderId || senderId}
                />
              }
              onChange={setSenderId}
              type='account'
            />
          </Modal.Columns>
          <Modal.Columns hint={t<string>('The beneficiary will have access to the transferred fees when the transaction is included in a block.')}>
            <InputAddress
              defaultValue={propRecipientId}
              help={t<string>('Select a contact or paste the address you want to send funds to.')}
              isDisabled={!!propRecipientId}
              label={t<string>('send to address')}
              labelExtra={
                <Available
                  label={t<string>('transferrable')}
                  params={propRecipientId || recipientId}
                />
              }
              onChange={setRecipientId}
              type='allPlus'
            />
            {recipientPhish && (
              <MarkError content={t<string>('The recipient is associated with a known phishing site on {{url}}', { replace: { url: recipientPhish } })} />
            )}
          </Modal.Columns>
          <Modal.Columns >
            {canToggleAll && isAll
              ? (
                <InputBalance
                  autoFocus
                  defaultValue={maxTransfer}
                  help={t<string>('The full account balance to be transferred, minus the transaction fees')}
                  isDisabled
                  key={maxTransfer?.toString()}
                  label={t<string>('transferrable minus fees')}
                />
              )
              : (
                <>
                  <InputBalance
                    autoFocus
                    help={t<string>('Type the amount you want to transfer.')}
                    isError={!hasAvailable}
                    isZeroable
                    label={t<string>('Amount')}
                    maxValue={maxTransfer}
                    onChange={setAmount}
                  />
                  <InputBalance
                    defaultValue={0}
                    help={t<string>('The minimum amount that an account should have to be deemed active')}
                    isDisabled
                    label={t<string>('Existential Deposit')}
                  />
                </>
              )
            }
          </Modal.Columns>
        </div>
      </Modal.Content>
      <Modal.Actions>
        {successCB &&  <TxButton
          onSuccess={successCB}
          accountId={propSenderId || senderId}
          icon='paper-plane'
          isDisabled={!hasAvailable || !(propRecipientId || recipientId) || !amount || !!recipientPhish}
          label={t<string>('Make Transfer')}
          onStart={onClose}
          params={
            canToggleAll && isAll
              ? isFunction(api.tx.balances?.transferAll)
                ? [propRecipientId || recipientId, false]
                : [propRecipientId || recipientId, maxTransfer]
              : [propRecipientId || recipientId, amount]
          }
          tx={
            canToggleAll && isAll && isFunction(api.tx.balances?.transferAll)
              ? api.tx.balances?.transferAll
              : isProtected
                ? api.tx.balances?.transferKeepAlive
                : api.tx.balances?.transfer
          }
        />}
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(Transfer)`
  background: rgb(249, 249, 249);

  .balance {
    margin-bottom: 0.5rem;
    text-align: right;
    padding-right: 1rem;

    .label {
      opacity: 0.7;
    }
  }

  label.with-help {
    flex-basis: 10rem;
  }

  .typeToggle {
    text-align: right;
  }

  .typeToggle+.typeToggle {
    margin-top: 0.375rem;
  }
`);
