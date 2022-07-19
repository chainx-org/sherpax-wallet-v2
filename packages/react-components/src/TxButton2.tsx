// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { TxButtonProps as Props } from './types';

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SubmittableResult } from '@polkadot/api';
import { useApi, useIsMountedRef } from '@polkadot/react-hooks';
import { assert, isFunction } from '@polkadot/util';

import Button from './Button';
import { StatusContext } from './Status';
import { useTranslation } from './translate';
// import {useWeb3React} from '@web3-react/core'
// import {Web3Provider} from '@ethersproject/providers'
import {ethers} from 'ethers'
import BigNumber from 'bignumber.js';
import { AccountContext } from '../../react-components-chainx/src/AccountProvider';

export const ETH_DEFAULT_ADDRESS = '0x0000000000000000000000000000000000000000'

function TxButton ({ accountId, className = '', extrinsic: propsExtrinsic, icon, isBasic, isBusy, isDisabled, isIcon, isToplevel, isUnsigned, label, onClick, onFailed, onSendRef, onStart, onSuccess, onUpdate, params, tooltip, tx, withSpinner, withoutLink }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const {currentAccount} = useContext(AccountContext)
  accountId = currentAccount

  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const { queueExtrinsic, queueAction } = useContext(StatusContext);
  const [isSending, setIsSending] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const needsAccount = !isUnsigned && !accountId;
  const [fee, setFee] = useState<number>(0)
  const isComingWallet = (window as any)?.web3?.currentProvider?.isComingWallet || (window as any)?.web3?.currentProvider?.isTrust

  const [section, method] = (tx || '').split('.');
  useEffect(()=>{
    if (
      isComingWallet
      ) {
        api.tx[section][method](...params as any[]).paymentInfo(currentAccount)
        .then(result => {
          const {partialFee} = result.toJSON()
          setFee(new BigNumber(partialFee as number).dividedBy(Math.pow(10, 18)).toNumber())
        })
      }
  },[])

  useEffect((): void => {
    (isStarted && onStart) && onStart();
  }, [isStarted, onStart]);

  const _onFailed = useCallback(
    (result: Error | SubmittableResult | null): void => {
      mountedRef.current && setIsSending(false);

      onFailed && onFailed(result);
    },
    [onFailed, setIsSending, mountedRef]
  );

  const _onSuccess = useCallback(
    (result: SubmittableResult): void => {
      mountedRef.current && setIsSending(false);

      onSuccess && onSuccess(result);
    },
    [onSuccess, setIsSending, mountedRef]
  );

  const _onStart = useCallback(
    (): void => {
      mountedRef.current && setIsStarted(true);
    },
    [setIsStarted, mountedRef]
  );

  const _onSend = useCallback(
    (): void => {
    try {
      let extrinsics: SubmittableExtrinsic<'promise'>[];
      if (propsExtrinsic) {
        extrinsics = Array.isArray(propsExtrinsic)
          ? propsExtrinsic
          : [propsExtrinsic];
        mountedRef.current && withSpinner && setIsSending(true);
        extrinsics.forEach((extrinsic): void => {
          queueExtrinsic({
            accountId: accountId && accountId.toString(),
            extrinsic,
            isUnsigned,
            txFailedCb: withSpinner ? _onFailed : onFailed,
            txStartCb: _onStart,
            txSuccessCb: withSpinner ? _onSuccess : onSuccess,
            txUpdateCb: onUpdate
          });
        });
        onClick && onClick();
      } else {
        const [section, method] = (tx || '').split('.');
        assert(api.tx[section] && api.tx[section][method], `Unable to find api.tx.${section}.${method}`);
        if (
          (window as any).web3 &&
          (window as any).web3.currentProvider &&
          (window as any).web3.currentProvider.isComingWallet
        ) {
          const param = (params as any[])?.map((item)=>{
            return String(item)
          })
          const signature = api.tx[section][method](...params as any[]).toHex()
        } else {
          extrinsics = [
            api.tx[section][method](...(
              isFunction(params)
                ? params()
                : (params || [])
            ))
          ];
          assert(extrinsics?.length, 'Expected generated extrinsic passed to TxButton');
          mountedRef.current && withSpinner && setIsSending(true);
          extrinsics.forEach((extrinsic): void => {
            queueExtrinsic({
              accountId: accountId && accountId.toString(),
              extrinsic,
              isUnsigned,
              txFailedCb: withSpinner ? _onFailed : onFailed,
              txStartCb: _onStart,
              txSuccessCb: withSpinner ? _onSuccess : onSuccess,
              txUpdateCb: onUpdate
            });
          });
          onClick && onClick();
        }
      }
      } catch(err){
        console.log('err',err)
        queueAction({
          action: t<string>('transfer'),
          message: 'address error',
          status: 'error'
        })
      }
    },
    [_onFailed, _onStart, _onSuccess, accountId, api.tx, isUnsigned, onClick, onFailed, onSuccess, onUpdate, params, propsExtrinsic, queueExtrinsic, setIsSending, tx, withSpinner, mountedRef]
  );


  if (onSendRef) {
    onSendRef.current = _onSend;
  }

  return (
    <Button
      className={className}
      icon={icon || 'check'}
      isBasic={isBasic}
      isBusy={isBusy}
      isDisabled={isSending || isDisabled || needsAccount}
      isIcon={isIcon}
      isToplevel={isToplevel}
      label={label || (isIcon ? '' : t<string>('Submit'))}
      onClick={_onSend}
      tooltip={tooltip}
      withoutLink={withoutLink}
    />
  );
}

export default React.memo(TxButton);
