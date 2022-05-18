import React, { useRef } from 'react';
import {Dropdown} from '@polkadot/react-components';
import styled from 'styled-components';

interface IntentionSelectProps {
  value: string,
  onChange: React.Dispatch<string>,
  style: any
}

const Wrapper = styled.div`
  > div {
      padding-left: 0 !important;
      > div> .dropdown{
        padding-top: 1.45rem !important;
        >i{
          top: 0 !important;
        }
      }
  }

`;


function IntentionSelect({value, onChange}: IntentionSelectProps): React.ReactElement<IntentionSelectProps> {
  const optionsRef = useRef([
    {text: '投票金额的 0.1 倍，没有锁定时间', value: 0},
    {text: '1x投票余额，锁定 1x 执行 (8.00 days)', value: 1},
    {text: '2x投票余额，锁定 2x 执行 (16.00 days)', value: 2},
    {text: '3x投票余额，锁定 4x 执行 (32.00 days)', value: 3},
    {text: '5x投票余额，锁定 16x 执行 (128.00 days)', value: 5}
  ]);
  return (
    <Wrapper>
      <Dropdown
        value={value}
        onChange={onChange}
        options={optionsRef.current}
        // type='account'
        withLabel
      />

    </Wrapper>
  );
}

export default IntentionSelect;
