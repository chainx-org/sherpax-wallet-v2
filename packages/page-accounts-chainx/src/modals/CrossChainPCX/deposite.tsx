// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { Dispatch, useContext, useEffect, useState } from "react";
import { Modal, StatusContext } from "@polkadot/react-components";
import { useTranslation } from "../../translate";
import styled from "styled-components";
import { u8aToHex, u8aToU8a, u8aWrapBytes } from "@polkadot/util";
import ClipBoard from "../deposite/ClipBoard";
import infoIcon from "../deposite/explan.svg";
import { useApi } from "@polkadot/react-hooks";
import getApiUrl from "../../../../apps/src/initSettings";
import Button from "../../../../react-components/src/Button";

interface Props {
  onClose: () => void;
  address: string;
}

const Wrapper = styled(Modal)`
  @media screen and (min-width: 540px) {
    min-width: 500px;
    max-width: 600px;
  }
  main.content {
    section.show-code {
      margin-top: 12px;
      background: #f2f3f4;
      border: 1px solid #dce0e2;
      border-radius: 6px;
      padding: 14px 12px;
      h3 {
        display: flex;
        justify-content: space-between;
        margin: 0 0 8px;
        opacity: 0.72;
        font-size: 13px;
        color: #000000;
        letter-spacing: 0.2px;
        line-height: 18px;
        span.title {
          font-weight: 500;
        }
        span.addr {
          opacity: 0.32;
          font-size: 13px;
          font-weight: 400;
          color: #000000;
          letter-spacing: 0.2px;
          text-align: right;
          line-height: 18px;
        }
        .channel span {
          opacity: 0.56;
          font-size: 13px;
          color: #000000;
          letter-spacing: 0.2px;
          text-align: right;
          line-height: 18px;
        }
      }
      .hex {
        margin-top: 8px;
        opacity: 0.32;
        font-size: 13px;
        color: #000000;
        letter-spacing: 0.2px;
        line-height: 18px;
      }
    }
    ul.info {
      margin-top: 12px;
      li {
        display: flex;
        align-items: center;
        img {
          width: 16px;
          margin-right: 6px;
        }
        &:not(:first-of-type) {
          margin-top: 6px;
        }
        opacity: 0.56;
        font-size: 12px;
        color: #000000;
        letter-spacing: 0.2px;
        line-height: 16px;
      }
    }
  }
  h2 {
    margin: 0;
    opacity: 0.72;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0.12px;
    line-height: 20px;
    span.step {
      color: #ecb417;
      margin-right: 8px;
    }
    &.step-2 {
      margin-top: 16px;
    }
  }
  p {
    opacity: 0.56;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0.12px;
    line-height: 20px;
    &.op-return,
    &.input {
      margin-top: 8px;
    }
  }
`;

export default function ({ address, onClose }: Props) {
  const { t } = useTranslation();
  // const [channel, setChannel] = useState('');
  // const {api} = useApi();
  // const apiUrl = getApiUrl();
  // const [hotAddress, setHotAddress] = useState<string>('');
  const [, setN] = useState(0);
  const { queueAction } = useContext(StatusContext);
  // const addressHex = u8aToHex(
  //   new TextEncoder('utf-8').encode(`${address}${channel ? '@' + channel : ''}`)
  // ).replace(/^0x/, '');
  const addressHex = "5Rdq5HiDWdMbc5zbVwTzaVN6fc2EPVFUF1e4u4CmjasgKAAW";
  // useEffect((): void => {
  //   async function getHotAddress() {
  //     if(apiUrl.includes('mainnet')) {
  //       const dividendRes = await api.rpc.xgatewaycommon.bitcoinTrusteeSessionInfo(-1);
  //       setHotAddress(dividendRes.hotAddress.addr);
  //     } else {
  //       setHotAddress('Please select [SherpaX Node] as Selected Network for sBTC cross-chain.');
  //     }
  //   }
  //   getHotAddress();
  // }, []);

  function _onCopy() {
    queueAction({
      action: t("clipboard"),
      message: t("copied"),
      status: "queued",
    });
  }

  // function TopUpLink() {
  //   location.href = `https://www.coming.chat/transfer?cointype=sBTC&address=${hotAddress}&opreturn=${addressHex}`
  // }
  return (
    <Wrapper header={t("Top Up")}>
      <Modal.Content>
        <main className="content">
          <h2>
            <span className="step">
              {"Transfer PCX to the destination address, you will receive the corresponding number of X-PCX"}
            </span>
          </h2>
          <section className="show-code">
            <h3>
              <span className="title">Destination address</span>
            </h3>
            <ClipBoard className="hex" id="" onClick={_onCopy}>
              {addressHex}
            </ClipBoard>
          </section>
          {/* <p className='input'>{t('Recharge OP_RETURN trust\'s hot multi-sign address with a wallet that supports OP_RETURN information')}</p> */}
          <p className="input">{"We recommend that you use chainxdapp or comingapp to transfer the PCX"}</p>
          <ul className={"info"}>
            {/* <li> */}
            {/* <img alt='info' src={infoIcon}/> */}
            {/* <span>{t('The top-up amount must be greater than 0.001 sBTC')}</span> */}
            {/* <span>{'The top-up amount must be greater than 0.001'}</span> */}
            {/* </li> */}
            <li>
              <img alt="info" src={infoIcon} />
              {/* <span>{t('The sBTC will arrive in 1~2 hours ')}</span> */}
              <span>{"The X-PCX will arrive in 10~20 mintues"}</span>
            </li>
          </ul>
        </main>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        {/* {
          (window as any).web3 &&
          (window as any).web3.currentProvider &&
          (window as any).web3.currentProvider.isComingWallet && apiUrl.includes('mainnet.sherpax') &&
          <Button
            className={''}
            onClick={TopUpLink}
            icon='sign-in-alt'
            label={t('Top Up')}
          />
        }   */}
        <a href="https://dapps.chainx.org" target="_self">
          <Button className={""} onClick={() => setN(Math.random())} icon="sign-in-alt" label={t("ChainX wallet")} />
        </a>
        <a href="https://www.comingchat.com/download" target="_self">
          <Button className={""} onClick={() => setN(Math.random())} icon="sign-in-alt" label={t("Coming App")} />
        </a>
      </Modal.Actions>
    </Wrapper>
  );
}
