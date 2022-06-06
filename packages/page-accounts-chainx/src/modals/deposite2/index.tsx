// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { QRCodeSVG } from 'qrcode.react';
import React, { Dispatch, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Modal, StatusContext } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { u8aToHex } from '@polkadot/util';

import getApiUrl from '../../../../apps/src/initSettings';
import Button from '../../../../react-components/src/Button';
import { useTranslation } from '../../translate';
import ClipBoard from './ClipBoard';
import infoIcon from './explan.svg';

interface Props {
  onClose: () => void;
  address: string;
  btc: string | undefined | null;
  account: string | undefined;
  setN: Dispatch<number>;
}

const Wrapper = styled(Modal)`
  //position: relative;
  width: 100%;
  @media screen and (max-width: 540px) {
    min-width: 500px;
    max-width: 600px;
  }
  main.step {
    line-height: 22px;
    font-weight: 500;
    font-size: 16px;
    div[class^="step-"] {
      position: relative;
      &:not(:first-child) {
        .tit {
          margin-top: 5px;
        }
      }
      &:last-child {
        .step-body {
          border: 0;
          padding-bottom: 0;
        }
      }
      .step-body {
        padding: 8px 0 26px 38px;
        margin-left: 11px;
        border-left: 2px dashed #367DFF;
        .code {
          width: 142px;
          height: 142px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        p {
          margin: 0;
          &.mt12 {
            margin-top: 12px;
          }
        }
        .show-code {
          background: #f2f3f4;
          border: 1px solid #dce0e2;
          border-radius: 6px;
          margin-bottom: 14px;
          > p {
            display: flex;
            align-items: center;
            &:first-child {
              border-bottom: 1px solid #dce0e2;
            }
            > span {
              display: block;
              height: 100%;
              padding: 7px 12px 5px 11px;
              &:first-child {
                width: 200px;
                height: 100%;
                font-size: 14px;
                color: #4E4E4E;
                line-height: 20px;
              }
              &:last-child {
                flex: 1;
                font-size: 14px;
                line-height: 42px;
                color: rgba(78, 78, 78, .8);
                white-space: break-spaces;
              }
            }
          }
        }
      }
      p {
        &.tit {
          margin: 0 0 5px 50px;
          span {
            color: #6098ff;
            padding-right: 10px;
          }
          &:before {
            content: '';
            position: absolute;
            left: 0;
            width: 24px;
            height: 24px;
            background: #6098FF;
            border-radius: 50%;
          }
        }
      }
    }
  }
`;

export default function ({ address, onClose }: Props) {
  const { t } = useTranslation();
  const [channel, setChannel] = useState('');
  const { api } = useApi();
  const apiUrl = getApiUrl();
  const [hotAddress, setHotAddress] = useState<string>('');
  const { queueAction } = useContext(StatusContext);
  const addressHex = u8aToHex(
    new TextEncoder('utf-8').encode(`${address}${channel ? '@' + channel : ''}`)
  ).replace(/^0x/, '');

  useEffect((): void => {
    async function getHotAddress () {
      if (apiUrl.includes('mainnet')) {
        const dividendRes = await api.rpc.xgatewaycommon.bitcoinTrusteeSessionInfo(-1);

        setHotAddress(dividendRes.hotAddress.addr);
      } else {
        setHotAddress('Please select [SherpaX Node] as Selected Network for sBTC cross-chain.');
      }
    }

    getHotAddress();
  }, []);

  function _onCopy () {
    queueAction({
      action: t('clipboard'),
      message: t('copied'),
      status: 'queued'
    });
  }

  function TopUpLink () {
    location.href = `https://www.coming.chat/transfer?cointype=sBTC&address=${hotAddress}&opreturn=${addressHex}`;
  }

  return (
    <Wrapper
      header={t('top up')}
      onClose={onClose}
    >
      <div className='center'>
        <Modal.Content>
          <main className='step'>
            <div className='step-1'>
              <p className='tit'><span className='font-pg-medium'>Step 1: </span>  Scan the QR code via ComingChat</p>
              <div className='step-body'>
                <div className='code'>
                  <QRCodeSVG
                    size={142}
                    value={`{"opreturn":"${address}","address":"${hotAddress}","cointype":"sBTC"}`}
                  ></QRCodeSVG>
                </div>
              </div>
            </div>
            <div className='step-2'>
              <p className='tit'><span className='font-pg-medium'>Step 2: </span>  Wait for the content in the form below to be automatically filled into the input box.</p>
              <div className='step-body'>
                <div className='show-code'>
                  <p> <span className='code-tit'>Trust hot multi-signature address</span> <ClipBoard
                    className=''
                    id=''
                    onClick={_onCopy}
                                                                                          >{hotAddress || 'In the generated.'}</ClipBoard>  </p>
                  <p> <span className='code-tit'>OP_RETURN</span><ClipBoard
                    className=''
                    id=''
                    onClick={_onCopy}
                                                                 >{address}</ClipBoard></p>
                </div>
                <p>（The table content is required, you can also manually copy it into the input box.）</p>
              </div>
            </div>
            <div className='step-3'>
              <p className='tit'><span className='font-pg-medium'>Step 3: </span></p>
              <div className='step-body'>
                <p>Please note that the top-up amount must be greater than 0.001 sBTC.</p>
                <p className='mt12'>Please wait patiently for the block to be generated and sBTC will be credited to your account within 1-2 hours.</p>
              </div>
            </div>
          </main>
        </Modal.Content>
      </div>
    </Wrapper>
  );
}
