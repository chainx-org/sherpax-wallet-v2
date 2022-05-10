import type {  DeriveBalancesAll } from '@polkadot/api-derive/types';
import React from 'react';
import styled from 'styled-components';
import {useApi} from '@polkadot/react-hooks';
import {toPrecision} from '@polkadot/app-accounts-chainx/Myview/toPrecision';
import BigNumber from 'bignumber.js';
import { Icon } from '@polkadot/react-components';
import { formatBalance } from '@polkadot/util';

const Title = styled.h6`
  margin: 0;
  margin-bottom: 7px;
  font-size: 16px;
  font-family: 'PingFangSC-Regular, PingFang SC,serif';
  font-weight: 400;
  color: #353D41;
  opacity: .8;
  line-height: 22px;
`;

const HelpValue = styled.span`
  margin-left: 4px;
  cursor: pointer;
  position: relative;
  z-index: 99;
  .helpCon::-webkit-scrollbar {
    // display: none;
  }
  .helpCon::-webkit-scrollbar-track{
    border-radius: 40px;
  }
  .helpCon {
    max-height:174px;
    overflow-y:auto;
    overflow-x:hidden;
    display: none;
    width: 247px;
    font-size: 12px;
    color: #000000;
    padding: 11px 12px;
    position: absolute;
    bottom: 21px;
    line-height:18px;
    right: -113px;
    background: rgba(255,255,255,1);
    border: 1px solid #EFEFEF;
    color: rgba(0,0,0);
    box-shadow: 0 4px 12px 0 rgba(0,0,0,0.12);
    border-radius: 10px;
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
  width: 92px;
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
`;

type Props = {
  title: string,
  bold?: any,
  help?: React.ReactNode,
  value: number,
  balancesAll?: DeriveBalancesAll;

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
`

export default function ({ bold, title, value, help }: Props): React.ReactElement<Props> {
  const {isApiReady} = useApi();
  const preciseValue: BigNumber = new BigNumber(toPrecision(value, 18))
  const decimalsValue = preciseValue.toNumber().toFixed(4).slice(-4)
  const intValue = preciseValue.toNumber().toFixed(8).slice(0,-8)
  return (
    <div>
      <Title>
        {title}
        { help ?
        <HelpValue className="helpmsg">
          <Icon icon='question-circle' size='1x'/>
          <div className="helpCon">{help}</div>
        </HelpValue> : "" }
      </Title>
      <Value className={bold ? 'bold' : ''}>
        {/* {props.value} */}
        {isApiReady ?
        // <FormatBalance
        //   className='result'
        //   value={value}
        //   />
          <LoadingValue>
            <span className='ui--FormatBalance-value"'>{intValue}</span>
            <span className='ui--FormatBalance-postfix'>{decimalsValue}</span>
            <span className='ui--FormatBalance-unit'>{formatBalance.getDefaults().unit && formatBalance.getDefaults().unit !== 'Unit'? formatBalance.getDefaults().unit : 'KSX'}</span>
          </LoadingValue>
          :
          <>
          {/*<div>{preciseValue.toNumber().toFixed(4)}</div>*/}
          <LoadingValue>
            <span className='ui--FormatBalance-value"'>{intValue}</span>
            <span className='ui--FormatBalance-postfix'>{decimalsValue}</span>
            <span className='ui--FormatBalance-unit'>{formatBalance.getDefaults().unit && formatBalance.getDefaults().unit !== 'Unit' ? formatBalance.getDefaults().unit : 'KSX'}</span>
          </LoadingValue>
        </>
          }
      </Value>
    </div>
  );
}
