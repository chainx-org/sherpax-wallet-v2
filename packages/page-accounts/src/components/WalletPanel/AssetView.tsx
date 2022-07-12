// [object Object]
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';

import BigNumber from 'bignumber.js';
import React, { useContext } from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/app-accounts/translate';
import { toPrecision } from '@polkadot/app-accounts-chainx/Myview/toPrecision';
import { Icon, TxButton2 as TxButton } from '@polkadot/react-components';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import { CoinPriceContext } from '@polkadot/react-components-chainx/CoinPriceProvider';
import { useApi, useLocked } from '@polkadot/react-hooks';
import { formatBalance } from '@polkadot/util';

const Title = styled.h6`
  position: relative;
  margin: 0;
  margin-bottom: 7px;
  font-size: 16px;
  font-weight: 400;
  color: rgba(53, 61, 65, .8);
  opacity: .8;
  &.fonts-14 {
    font-size: 14px;
  }
  svg {
    color: rgba(53, 61, 65, .8);
  }
  line-height: 22px;
`;

const HelpValue = styled.span`
  margin-left: 4px;
  cursor: pointer;
  //position: relative;
  z-index: 99;
  .helpCon::-webkit-scrollbar {
    // display: none;
  }
  .helpCon::-webkit-scrollbar-track{
    border-radius: 40px;
  }
  .helpCon {
    p {
      margin-bottom: 0;
    }
    &::before {
      content: '';
      position: absolute;
      border: 6px solid transparent;
      border-top-color: rgba(0, 0, 0, 0.76);
      bottom: -11px;
      left: 50%;
      transform: translateX(-50%);
    }
    &.left21-5 {
      left: -21.5%;
    }
    &.left22-5 {
      left: -22.5%;
    }
    max-height:174px;
    //overflow-y:auto;
    //overflow-x:hidden;
    display: none;
    width: 247px;
    font-size: 12px;
    padding: 11px 12px;
    position: absolute;
    bottom: 30px;
    line-height:18px;
    left: -40.5%;
    background: rgba(0, 0, 0, 0.76);
    box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.16), 0 0 8px 0 rgba(0, 0, 0, 0.08);
    color: white;
    border-radius: 10px;
    z-index: 999999;
    @media screen and (min-width:376px) and (max-width: 414px){
      bottom: 26px;
      left: -120px;
      &:after {
        left: 39% !important;
      }
    }
    @media screen and (max-width: 376px){
      bottom: 26px;
      left: -120px;
      &:after {
        left: 39% !important;
      }
    }
    // &:after {
    //   border-left: 5px solid transparent;
    //   border-right: 5px solid transparent;
    //   border-top: 5px solid #fff;
    //   content: "";
    //   position: absolute;
    //   width: 0;
    //   left: 50%;
    //   bottom: -5px
    // }
  }
  &:hover .helpCon {
    display: block;
  }
`;

const Value = styled.div`
  font-size: 16px;
  font-family: 'PingFangSC-Medium, PingFang SC,serif';
  font-weight: 500;
  color: #353D41;
  line-height: 22px;

  &.bold{
    font-size: 24px;
    font-family: 'PingFangSC-Semibold, PingFang SC,serif';
    font-weight: 600;
    color: #353D41;
    line-height: 33px;
  }


  .dollar {
    padding-left: 10px;
    font-size: 18px;
    font-weight: normal;
    opacity: .8;
    &.small-px {
      font-size: 14px;
    }
  }
  img.down {
    cursor: pointer;
    vertical-align: middle;
    padding-left: 10px;
  }
`;

type Props = {
  title: string,
  bold?: any,
  help?: React.ReactNode,
  value: number,
  balancesAll?: DeriveBalancesAll,
  className?: string,
  unLock?: boolean,
  vesting?: any,
  event?: string
  stateN?: any
}

const LoadingValue = styled.div`

  display: inline-block;
  vertical-align: baseline;
  white-space: nowrap;
  > .ui--FormatBalance-postfix {
    vertical-align: baseline;
  }
  >.ui--FormatBalance-unit {
    font-size: 0.825em;
    text-align: right;
    margin-left: 8px;
  }
  .ClaimBtn {
    &.isDisabled {
      cursor: not-allowed;
    }
    display: inline-block;
    padding: 0;
    cursor: pointer;
    text-align: center;
    font-size: 13px;
    width: 63px;
    height: 24px;
    background: #FFFFFF;
    color: #6098FF;
    line-height: 24px;
    border-radius: 2px;
    vertical-align: middle;
    margin-left: 12px;
  }
`;

export default function ({ bold, className, event, help, stateN, title, unLock, value, vesting }: Props): React.ReactElement<Props> {
  const { isApiReady } = useApi();
  const preciseValue: BigNumber = new BigNumber(toPrecision(value, 18));
  const targetValue = Number(preciseValue.toJSON()).toFixed(4);
  const decimalsValue = preciseValue.toNumber().toFixed(4).slice(-4);
  const intValue = preciseValue.toNumber().toFixed(8).slice(0, -8);
  const { btcDollar, coinExchangeRate } = useContext(CoinPriceContext);
  const { t } = useTranslation();
  const { currentAccount } = useContext(AccountContext);

  const [wksxObj] = coinExchangeRate.filter((item: any) => item.coin === 'KSX');

  return (
    <div>
      <Title className='fonts-14'>
        {title}
        { help
          ? <HelpValue className='helpmsg'>
            <Icon
              icon='question-circle'
              size='1x'
            />
            <div className={`helpCon ${className}`}>{help}</div>
          </HelpValue>
          : '' }
      </Title>
      <Value className={bold ? 'bold' : ''}>
        {isApiReady &&
          <LoadingValue>
            <span className='ui--FormatBalance-value"'>{targetValue !== 'NaN' ? targetValue : '0.0000'} KSX   </span>
            {/* <span className='ui--FormatBalance-unit'> */}
            {/*  {formatBalance.getDefaults().unit && formatBalance.getDefaults().unit !== 'Unit'? formatBalance.getDefaults().unit : 'KSX'} */}
            {/* </span> */}
            <>
              <span className={`dollar ${className}`}>
                  (≈ ${(Number(Number(targetValue) * wksxObj?.price).toFixed(2)) !== 'NaN' ? Number(Number(targetValue) * wksxObj?.price).toFixed(2) : '0.0000'})
              </span>
              {vesting && isApiReady && stateN && (<TxButton
                accountId={currentAccount}
                className='ClaimBtn'
                icon={'none-icon'}
                isDisabled={!(Math.max(vesting.feeFrozen, vesting.miscFrozen) > 0)}
                label={t('Unlock')}
                onSuccess={() => {
                  stateN(Math.random());
                  // vesting.setN(Math.random());
                }}
                params={[]}
                tx={event}
              />
              )}
            </>
          </LoadingValue>
        }
      </Value>
    </div>
  );
}
