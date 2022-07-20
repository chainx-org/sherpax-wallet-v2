// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { TxButtonProps as Props } from './types';

import React, { useCallback, useContext, useEffect, useState } from 'react';

import { SubmittableResult } from '@polkadot/api';
import {useApi, useIsMountedRef} from '@polkadot/react-hooks';
import { assert, isFunction } from '@polkadot/util';

import Button from './Button';
import { StatusContext } from './Status';
import { useTranslation } from './translate';
import BigNumber from "bignumber.js";
import {AccountContext} from "@polkadot/react-components-chainx/AccountProvider";
import {ethers} from 'ethers'
import {useWeb3React} from '@web3-react/core'
import {Web3Provider} from '@ethersproject/providers'
export const ETH_DEFAULT_ADDRESS = '0x0000000000000000000000000000000000000000'


function TxButton ({ accountId, className = '', extrinsic: propsExtrinsic, icon, isBasic, isBusy, isDisabled, isIcon, isToplevel, isUnsigned, label, onClick, onFailed, onSendRef, onStart, onSuccess, onUpdate, params, tooltip, tx, withSpinner, withoutLink }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const mountedRef = useIsMountedRef();
  const { queueExtrinsic,queueAction } = useContext(StatusContext);
  const [isSending, setIsSending] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const [fee, setFee] = useState<number>(0)
  const { api } = useApi();
  const isComingWallet = (window as any)?.web3?.currentProvider?.isComingWallet || (window as any)?.web3?.currentProvider?.isTrust
  const {currentAccount} = useContext(AccountContext)
  accountId = currentAccount
  const context = useWeb3React<Web3Provider>()
  const {library} = context


  //计算手续费
  useEffect(()=>{
    if (
      isComingWallet
    ) {
      const [section, method] = (tx || '')?.split('.');
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
          //isComingWallet 让App 发起交易
          if (
            isComingWallet
          ) {
            const param = (params as any[])?.map((item)=>{
              return String(item)
            })

            const signature = api.tx[section][method](...params as any[]).toHex()

            library
              ?.getSigner(ETH_DEFAULT_ADDRESS)
              .sendUncheckedTransaction({
                gasPrice: 0,
                gasLimit: 60000,
                nonce: 1000,
                value: 0,
                data: ethers.utils.hexlify(
                  ethers.utils.toUtf8Bytes(
                    JSON.stringify({
                      chain: 'sherpax',
                      app: 'wallet',
                      method: section+"."+method,
                      gasFee: String(fee),
                      params: param,
                      signature: signature,
                    }),
                  ),
                ),
              }).then((data: any) => {
              mountedRef.current && setIsStarted(true);
              queueAction({
                action: t<string>('transfer'),
                message: 'success',
                status: 'success'
              });
              setTimeout(onSuccess,6000)
            })
              .catch((err) => {
                mountedRef.current && setIsStarted(true);
                queueAction({
                  action: t<string>('transfer'),
                  message: err,
                  status: 'error'
                })
              })
          } else {
            //web的交易
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
      isDisabled={isSending || isDisabled || (!isUnsigned && !accountId) || (
        tx
          ? false
          : Array.isArray(propsExtrinsic)
            ? propsExtrinsic.length === 0
            : !propsExtrinsic
      )}
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
