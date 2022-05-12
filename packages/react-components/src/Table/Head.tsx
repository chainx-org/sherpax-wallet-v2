// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import Icon from '../Icon';

type HeaderDef = [React.ReactNode?, string?, number?, (() => void)?];

interface Props {
  className?: string;
  filter?: React.ReactNode;
  header?: (null | undefined | HeaderDef)[];
  isEmpty: boolean;
}

function Head ({ className = '', filter, header, isEmpty }: Props): React.ReactElement<Props> | null {
  if (!header?.length) {
    return null;
  }

  return (
    <thead className={className}>
      {filter && (
        <tr className='filter'>
          <th colSpan={100}>{filter}</th>
        </tr>
      )}
      <tr>
        {header.filter((h): h is HeaderDef => !!h).map(([label, className = 'default', colSpan = 1, onClick], index) =>
          <th
            className={className}
            colSpan={colSpan}
            key={index}
            onClick={onClick}
          >
            {index === 0
              ? (
                <h1>
                  <Icon
                    className='highlight--color'
                    icon='dot-circle'
                  />
                  {label}
                </h1>
              )
              : isEmpty
                ? ''
                : label
            }
          </th>
        )}
      </tr>
    </thead>
  );
}

export default React.memo(styled(Head)`
  position: relative;
  display: inline-block;
  border: 1px solid #DCE0E2;
  z-index: 99999;
  margin-bottom: 5px;
  font-family: 'PingFangSC-Regular, PingFang SC,serif';
  width: 100%;
  background: white;
  th {
    box-sizing: border-box;
    flex: 1;
    text-transform:capitalize;
    font: var(--font-sans);
    font-weight: var(--font-weight-normal);
    padding: 0.375rem 0;
    text-align: left;
    vertical-align: middle;
    white-space: nowrap;
    height: 40px;
    line-height: 30px;

    h1, h2 {
      font-size: 1.75rem;
    }

    h1 {
      margin-top: 4px;
      vertical-align: middle;
      text-transform: capitalize;
      font-size: 16px;
      font-family: inherit;
      font-weight: 400;
      color: #4E4E4E;
      line-height: 22px;

      .ui--Icon {
        font-size: 1rem;
        margin-right: 0.5rem;
        vertical-align: middle;
      }
    }



    &:last-child {
      border-right: 1px solid var(--border-table);
    }

    &.address {
      padding-left: 3rem;
      text-align: left;
    }

    &.badge {
      padding: 0;
    }

    &.expand {
      text-align: right;
    }

    &.isClickable {
      border-bottom: 2px solid transparent;
      cursor: pointer;
    }

    &.mini {
      padding: 0 !important;
    }

    &.no-pad-left {
      padding-left: 0.125rem;
    }

    &.no-pad-right {
      padding-right: 0.125rem;
    }

    &.start {
      text-align: left;
    }

    &.balances {
      text-align: right;
      padding-right: 2.25rem;
    }
  }

  tr {
    display: flex;
    background: var(--bg-table);
    &.filter {
      .ui.input,
      .ui.selection.dropdown {
        background: transparent;

        &:first-child {
          margin-top: -1px;
        }
      }

      th {
        padding: 0;
        text-transform:capitalize;
      }
    }

    &:not(.filter) {
      th {
        font-family: 'PingFangSC-Medium, PingFang SC,serif';
        width: 147px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(78, 78, 78, .8);
      }
    }
  }
`);
