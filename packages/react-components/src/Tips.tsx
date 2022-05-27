// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, {useContext} from 'react';
import styled from "styled-components";
import {BubbleContext} from "@polkadot/react-components-chainx/BubbleProvider";

interface Props {
  text:string
  className:string
  children:React.ReactNode
}

function Tips ({ text,className,children }: Props): React.ReactElement<Props> {
  const { bubble } = useContext(BubbleContext);

  return (
   <div className={`tips ${className}`}>
     <div style={{position:"relative"}}>
       {children}
       <div className={`bubble ${bubble ? 'hide' : ''}`}>{text}</div>
     </div>
   </div>
  )
}

export default React.memo(styled(Tips)`
  position: relative;
  .bubble {
    &.hide {
      display: none!important;
    }
    display: none;
    width: 50%;
    position: absolute;
    word-wrap:break-word;
    left: 30px;
    top: -100px;
    background: #FFFFFF;
    padding: 18px 20px;
    box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.16), 0 0 8px 0 rgba(0, 0, 0, 0.08);
    border: 1px solid #DCE0E2;
    font-family: 'PingFangSC-Medium, PingFang SC,serif';
    font-weight: 500;
    color: #4E4E4E;
    line-height: 18px;
    text-align: center;
    z-index: 999;

    &::after {
      position: absolute;
      z-index: 99;
      bottom: -12px;
      left: 50%;
      transform: translateX(-50%);
      content: '';
      border: 6px solid transparent;
      border-top-color: white;
    }
    &::before {
      position: absolute;
      left: 0;
      bottom: -10px;
      content: '';
      width: 100%;
      height: 10px;
      background: transparent;
    }
    &:hover {
      display: block;
    }
  }



`);
