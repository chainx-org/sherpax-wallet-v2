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

interface Props {
  onClose: () => void;
  address: string;
  btc: string | undefined | null;
  account: string | undefined;
  setN: Dispatch<number>;
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

  return (
    <Wrapper header={t("Top Up")}>
      <Modal.Content>
        <main className="content">
          <h2>
            <span className="step">{t("The First Step")}</span>
            <span className="text">{t("get OP_RETURN")}</span>
          </h2>
          <p className={"op-return"}>{t("Get the information for the 16-OP_RETURN address")}</p>
          <section className="show-code">
            <h3>
              <span className="title">OP_RETURN</span>
            </h3>
            <ClipBoard className="hex" id="">
              {addressHex}
            </ClipBoard>
          </section>
          <h2 className="step-2">
            <span className="step">{t("The Second Step")}</span>
            <span className="text">{t("start a cross-chain top-up")}</span>
          </h2>
          <p className="input">
            {t("Recharge OP_RETURN trust's hot multi-sign address with a wallet that supports OP_RETURN information")}
          </p>
          <ul className={"info"}>
            <li>
              <img alt="info" src={infoIcon} />
              <span>{t("The top-up amount must be greater than 0.001 BTC")}</span>
            </li>
            <li>
              <img alt="info" src={infoIcon} />
              <span>
                {t("Currently, only cross-chain top-up initiated by BTC addresses starting with 1 and 3 is supported")}
              </span>
            </li>
          </ul>
          <section className="show-code">
            <h3 style={{ marginBottom: 0 }}>
              <span className="title">{t("Trust hot multi-signature address")}</span>
              <ClipBoard className={"addr"} id="">
                {hotAddress}
              </ClipBoard>
            </h3>
          </section>
        </main>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}></Modal.Actions>
    </Wrapper>
  );
}
