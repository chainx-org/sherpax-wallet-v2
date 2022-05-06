// [object Object]
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

const SettingNodeWrapper = styled.div`
  ul {
    margin:0 ;
  }
  > .right{
    display: flex;
    align-items: center;

    > li{
      margin: 1.4em 1em 1.4em 1em;

      &.switchNode{
        display: flex;
        align-items: center;
        font-size: 12px;
        padding: 0.5em 1.3em 0.5em 1.3em;
        background: rgba(249, 249, 249);
        border: 1px solid #EFEFEF;
        border-radius: 18px;

        .netInfo{
          text-transform: capitalize;
          min-width: 5.5rem;
        }

        > div {
          margin-right: 0.5em;

          &.circle{
            height: 0.5em;
            width: 0.5em;
            border-radius: 50%;
            background: rgba(52, 198, 154);
          }
        }

        &:hover{
          color: rgba(0,0,0,0.8);
          cursor: pointer;
        }
      }

      &.icon{
        margin: 1.1em 0.6em 1.1em 0.6em;
        display: flex;
        align-items: center;

        a{
          display: flex;
          align-items: center;

          svg{
            color: #8E8E8E;

          }
        }

        &:hover{
          cursor: pointer;

          svg{
            color: #282828;
          }
        }
      }

      &.accountSelector{
        margin: 0;
      }
    }
  }
`;

export default SettingNodeWrapper;
