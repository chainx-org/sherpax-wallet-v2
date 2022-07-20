// Copyright 2017-2022 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useState } from 'react';

import { Button, InputAddress, InputBalance, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  accountId: string;
  assetId: BN;
  className?: string;
  minBalance: BN;
  siFormat: [number, string];
  onSuccess: () => void
}

function Transfer ({ accountId, onSuccess, assetId, className, minBalance, siFormat: [siDecimals, siSymbol] }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleOpen] = useToggle();
  const [amount, setAmount] = useState<BN | null>(null);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [isProtected, setIsProtected] = useState(true);

  return (
    <>
      <Button
        className={` send-button padd16 ${className}`}
        icon='paper-plane'
        label={t<string>('Send')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          className={className}
          header={t<string>('transfer asset')}
          onClose={toggleOpen}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('The account to transfer from. This account should have sufficient assets for this transfer.')}>
              <InputAddress
                defaultValue={accountId}
                isDisabled
                label={t<string>('send from')}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The beneficiary will have access to the transferred asset when the transaction is included in a block.')}>
              <InputAddress
                label={t<string>('send to address')}
                onChange={setRecipientId}
                type='allPlus'
              />
            </Modal.Columns>
            <Modal.Columns>
              <InputBalance
                autoFocus
                label={t<string>('amount to transfer')}
                onChange={setAmount}
                siDecimals={siDecimals}
                siSymbol={siSymbol}
              />
            </Modal.Columns>
            <Modal.Columns>
              <InputBalance
                defaultValue={minBalance}
                isDisabled
                label={t<string>('minimum balance')}
                siDecimals={siDecimals}
                siSymbol={siSymbol}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='paper-plane'
              isDisabled={!recipientId || !amount}
              label={t<string>('Send')}
              onStart={toggleOpen}
              onSuccess={onSuccess}
              params={[assetId, recipientId, amount]}
              tx={'assets.transfer'}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Transfer);
