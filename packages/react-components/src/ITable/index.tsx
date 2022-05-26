// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import Body from './Body';
import Foot from './Foot';
import Head from './Head';

interface TableProps {
  children: React.ReactNode;
  className?: string;
  empty?: React.ReactNode | false;
  emptySpinner?: React.ReactNode;
  filter?: React.ReactNode;
  footer?: React.ReactNode;
  header?: [React.ReactNode?, string?, number?, (() => void)?][];
  isFixed?: boolean;
  legend?: React.ReactNode;
  noBodyTag?: boolean;
  withCollapsibleRows: boolean;
}

function extractBodyChildren (children: React.ReactNode): [boolean, React.ReactNode] {
  if (!Array.isArray(children)) {
    return [!children, children];
  }

  const kids = children.filter((child) => !!child);
  const isEmpty = kids.length === 0;

  return [isEmpty, isEmpty ? null : kids];
}

function ITable ({ children, className = '', empty, emptySpinner, filter, footer, header, isFixed, legend, noBodyTag, withCollapsibleRows = false }: TableProps): React.ReactElement<TableProps> {
  const [isEmpty, bodyChildren] = extractBodyChildren(children);
  return (
    <div className={`ui--Table ${className}`}>
      {legend}
      <table className={`${(isFixed && !isEmpty) ? 'isFixed' : 'isNotFixed'} highlight--bg-faint${withCollapsibleRows ? ' withCollapsibleRows' : ''}`}>
        <Head
          filter={filter}
          header={header}
          isEmpty={isEmpty}
        />
        <Body
          empty={empty}
          emptySpinner={emptySpinner}
          noBodyTag={noBodyTag}
        >
          {bodyChildren}
        </Body>
        <Foot
          footer={footer}
          isEmpty={isEmpty}
        />
      </table>
    </div>
  );
}

export default React.memo(styled(ITable)`
  //margin-bottom: 28px;
  max-width: 100%;
  width: 100%;


  &.transfer {
    table {
      background: red!important;
      tbody {
        tr {

          td {
            padding-right: 0;
            &:first-child {
              justify-content: start;
              align-items: center;
              padding-left: 24px;
            }
            &:last-child {
              flex: 1.5;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            &:nth-child(3) {
              flex: .5;
            }
            margin: 0;
            flex: 1;
            text-align: left;
          }
        }
      }
    }
  }



  table {
    border-spacing: 0;
    max-width: 100%;
    overflow: hidden;
    position: relative;
    border-collapse:collapse!important;
    width: 100%;
    z-index: 1;
    background: rgb(245, 243, 241)!important;

    &.isFixed {
      table-layout: fixed;
    }

    tr {
      max-width: 100%;
      width: 100%;

      td,
      &:not(.filter) th {
        &.all {
          width: 100%;

          &:not(.overflow) {
            word-break: break-word;
          }

          summary {
            white-space: normal;
          }
        }
      }
    }

    &.withCollapsibleRows tbody tr {
      background-color: unset;
      &:nth-child(4n - 2),
      &:nth-child(4n - 3) {
        background-color: var(--bg-table);
      }
    }
  }

  tbody {
    width: 100%;
    background: white!important;
    tr:last-child {
      border-bottom: 1px solid #DCE0E2;
    }
    tr {
      display:flex!important;
      width: 100%;
      height: 48px;
      line-height: 48px;
    }

    td {
      font-family: 'PingFangSC-Medium, PingFang SC,serif';
      flex: 1;
      text-align: left;
      height: 46px;
      font-size: 14px;
      font-weight: 500;
      color: #4E4E4E;
      line-height: 46px;
      .right {
        display: inline-block;
        vertical-align: top;
        width: 40px;
        text-align: right;
      }

      img {
        width: 26px;
        height: 26px;
        margin-right: 7px;
      }

      &:first-child {
        flex: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
      &:last-child {
        text-align: center;
      }

      //&:first-child {
      //  border-left: 1px solid var(--border-table);
      //}
      //
      //&:last-child {
      //  border-right: 1px solid var(--border-table);
      //}

      label {
        display: block !important;
        white-space: nowrap;
      }

      div.empty {
        opacity: 0.6;
        padding: 0.25rem;
      }

      .ui--Spinner {
        margin: 0 auto;

        .text {
          margin-bottom: 0;
        }
      }

      &.address {
        min-width: 11rem;
        overflow-x: hidden;
      }

      &.badge {
        padding: 0.5rem;
      }

      &.button {
        padding: 0.25rem 0.5rem;
        text-align: right;
        white-space: nowrap;

        > * {
          vertical-align: middle;
        }

        .ui--Toggle {
          display: inline-block;
          white-space: nowrap;

          label {
            display: inline-block !important;
          }
        }
      }

      &.combined {
        border-top-width: 0;
      }

      &.expand {
        &:not(.left) {
          text-align: right;
        }

        .ui--Expander + .ui--Expander {
          margin-top: 0.375rem;
        }
      }

      &.hash {
        font: var(--font-mono);
      }

      &.links {
        padding: 0.5rem 0.75rem;
        text-align: center;
        width: 0;
      }

      &.no-pad-left {
        padding-left: 0.125rem;
      }

      &.no-pad-right {
        padding-right: 0.125rem;
      }

      &.no-pad-top {
        padding-top: 0.125rem;
      }

      &.number {
        text-align: right;
      }

      &.relative {
        position: relative;
      }

      &.overflow {
        max-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: none;
      }

      &.start {
        text-align: left;
      }

      &.together {
        white-space: nowrap;
      }

      &.top {
        vertical-align: top;
      }

      &.middle {
        text-align: center;
      }

      &.mini {
        padding: 0 !important;
        width: fit-content;
        white-space: normal;

        > div {
          margin-right: 0.75rem;
          max-width: 3.8rem;
          min-width: 3.8rem;
        }
      }

      &.upper {
        text-transform: uppercase;
      }

      &.favorite .ui--Icon.isSelected {
        color: darkorange;
      }

      .ui--Button-Group .ui--Button:not(.isToplevel) {
        margin: 0;
      }
    }

    tr {
      display: inline-block;
      border: 1px solid #DCE0E2;
      border-bottom :1px solid transparent;
      &.hasOddRowColoring,
      &:nth-child(odd) {
        background: var(--bg-table);
      }


      //&:first-child {
      //  td {
      //    border-top: 0.25rem solid var(--bg-page);
      //  }
      //
      //  td:first-child {
      //    border-top-left-radius: 0.25rem;
      //  }
      //
      //  td:last-child {
      //    border-top-right-radius: 0.25rem;
      //  }
      //}

      &:nth-child(even) {
        background: rgb(248, 249, 250)!important;
      }

      &:last-child {
        td {
          border-bottom: 1px solid var(--border-table);

          &:first-child {
            border-bottom-left-radius: 0.25rem;
          }

          :last-child {
            border-bottom-right-radius: 0.25rem;
          }
        }
      }

      &.transparent {
        background: transparent;
      }

      &.noBorder td {
        border-bottom: 1px solid transparent;
        padding-bottom: 0 !important;
      }

      .ui--Button-Group {
        margin: 0;
      }

      .ui--Button:not(.isIcon):not(:hover) {
        background: transparent !important;
        box-shadow: none !important;
      }

      .ui.toggle.checkbox input:checked ~ .box:before,
      .ui.toggle.checkbox input:checked ~ label:before {
        background-color: #eee !important;
      }
    }
  }

`);
