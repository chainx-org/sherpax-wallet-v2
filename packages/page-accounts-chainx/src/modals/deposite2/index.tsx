// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { Dispatch, useEffect, useState } from "react";
import { Modal } from "@polkadot/react-components";
import { useTranslation } from "../../translate";
import styled from "styled-components";
import { u8aToHex } from "@polkadot/util";
import ClipBoard from "./ClipBoard";
import infoIcon from "./explan.svg";
import { useApi } from "@polkadot/react-hooks";
import {QRCodeSVG} from 'qrcode.react';


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
    font-family: 'PingFangSC-Medium, PingFang SC,serif';
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
      }
      p {
        &.tit {
          margin: 0 0 5px 50px;
          span {
            color: #6098ff;
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
  //addressHex hotAddress
  const { t } = useTranslation();
  const [channel, setChannel] = useState("");
  const { api } = useApi();
  const [hotAddress, setHotAddress] = useState<string>("");
  const addressHex = u8aToHex(new TextEncoder("utf-8").encode(`${address}${channel ? "@" + channel : ""}`)).replace(
    /^0x/,
    ""
  );

  useEffect((): void => {
    async function getHotAddress() {
      const dividendRes = await api.rpc.xgatewaycommon.bitcoinTrusteeSessionInfo();
      setHotAddress(dividendRes.hotAddress.addr);
    }

    getHotAddress();
  }, []);

  console.log(hotAddress,'hotAddress')
  console.log(addressHex,'addressHex')

  return (
    <Wrapper header={t("Top Up")}>
      <div className="center">
        <Modal.Content>
          <main className="step">
            <div className="step-1">
              <p className="tit"><span>Step 1: </span>  Scan the QR code via ComingChat</p>
              <div className="step-body">
                <div className="code">
                  <QRCodeSVG size={142} value={'11111'}></QRCodeSVG>
                </div>
              </div>
            </div>
            <div className="step-1">
              <p className="tit"><span>Step 2: </span>  Wait for the content in the form below to be automatically filled into the input box.</p>
              <div className="step-body">
                <p>（The table content is required, you can also manually copy it into the input box.）</p>
              </div>
            </div>
            <div className="step-3">
              <p className="tit"><span>Step 3: </span></p>
              <div className="step-body">
                <p>Please note that the top-up amount must be greater than 0.001 sBTC.</p>
                <p  className="mt12">Please wait patiently for the block to be generated and sBTC will be credited to your account within 1-2 hours.</p>
              </div>
            </div>
          </main>
        </Modal.Content>
        <Modal.Actions onCancel={onClose}></Modal.Actions>
      </div>
    </Wrapper>
  );
}
