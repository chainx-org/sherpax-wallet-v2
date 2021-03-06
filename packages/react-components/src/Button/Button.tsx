// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ButtonProps } from './types';

import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';

import Icon from '../Icon';
import Spinner from '../Spinner';

function Button ({ activeOnEnter, children, className = '', dataTestId = '', icon, isBasic, isBusy, isCircular,
                   isDisabled, isFull, isIcon, isSelected, isToplevel, label, onClick, isReadOnly = false,
                   onMouseEnter, onMouseLeave, tabIndex, withoutLink,iconUrl }: ButtonProps): React.ReactElement<ButtonProps> {
  const _onClick = useCallback(
    (): void => {
      !(isBusy || isDisabled) && onClick && onClick();
    },
    [isBusy, isDisabled, onClick]
  );

  const _onMouseEnter = useCallback((): void => {
    onMouseEnter && onMouseEnter();
  }, [onMouseEnter]);

  const _onMouseLeave = useCallback((): void => {
    onMouseLeave && onMouseLeave();
  }, [onMouseLeave]);

  const listenKeyboard = useCallback((event: KeyboardEvent): void => {
    if (!isBusy && !isDisabled && event.key === 'Enter') {
      onClick && onClick();
    }
  }, [isBusy, isDisabled, onClick]);

  useEffect(() => {
    if (activeOnEnter) {
      window.addEventListener('keydown', listenKeyboard, true);
    }

    return () => {
      if (activeOnEnter) {
        window.removeEventListener('keydown', listenKeyboard, true);
      }
    };
  }, [activeOnEnter, listenKeyboard]);

  return (
    <button
      className={`ui--Button${label ? ' hasLabel' : ''}${isBasic ? ' isBasic' : ''}${isCircular ? ' isCircular' : ''}${isFull ? ' isFull' : ''}${isIcon ? ' isIcon' : ''}${(isBusy || isDisabled) ? ' isDisabled' : ''}${isBusy ? ' isBusy' : ''}${isReadOnly ? '' : !onClick ? 'isReadOnly' : ''}${isSelected ? ' isSelected' : ''}${isToplevel ? ' isToplevel' : ''}${withoutLink ? ' withoutLink' : ''} ${className}`}
      data-testid={dataTestId}
      onClick={_onClick}
      onMouseEnter={_onMouseEnter}
      onMouseLeave={_onMouseLeave}
      tabIndex={tabIndex}
    >
      {icon && icon !== "none-icon" &&  <Icon icon={icon}  />}
      {iconUrl && <span className="icon-box"><img src={iconUrl} alt="icon"/></span>}
      {label}
      {children}
      <Spinner
        className='ui--Button-spinner'
        variant='cover'
      />
    </button>
  );
}

const ICON_PADDING = 0.5;

export default React.memo(styled(Button)`
  background: transparent;
  border: none;
  cursor: pointer;
  line-height: 1;
  margin: 0;
  outline: none;
  position: relative;
  //vertical-align: middle;
  text-align: center;
  color:  #4E4E4E;
  svg {
    color: white!important;
  }
  .icon-box {
    display: inline-block;
    background: #6098FF;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    line-height: 28px;
    text-align: center;
    margin-right: 0.425rem !important;
    img {
      vertical-align: middle;
      margin-top: -3px;
    }
  }

  &:hover {
    color: white!important;
    &.isDisabled, &.isReadOnly {
      color:  #bcbbba!important;
    }
  }

  &.white {
    svg {
      color: white!important;
    }
  }

  &.mar15 {
    margin-right: 15px;
  }

  &.send-button {
    &.padd16 {
      padding: 0.7rem 16px!important;
    }
    &.padd10 {
      padding: 5px 16px;
    }
    text-transform: capitalize;
    svg {
      color: white!important;
      background: rgb(96, 152, 255)!important;
    }

    &:hover {
      &.isDisabled, &.isReadOnly {
        background: rgb(96, 152, 255)!important;
        cursor: pointer;
        color:  white!important;
      }
    }

    svg {
      margin-right: 8px;
    }
  }
  &.send-24 {
    margin-top: -4px;
    svg {
      width: 10px;
      height: 10px;
    }
  }

  &.send-28 {
    margin-top: 0;
    vertical-align: middle;
    svg {
      width: 14px;
      height: 14px;
    }
  }

  &:not(.hasLabel) {
    padding: 0.7em;

    .ui--Icon {
      padding: 0.6rem;
      margin: -0.6rem;
    }
  }

  &:not(.isCircular) {
    border-radius: 0.25rem;
  }

  &:focus {
    outline:0;
  }

  &.hasLabel {
    padding: 0.7rem 1.1rem 0.7rem ${1.1 - ICON_PADDING}rem;

    .ui--Icon {
      color: white;
      margin-right: 0.425rem !important;
      &:hover {
        svg {
          color: white;
        }
      }
    }
  }

  &.isBasic {
    background: var(--bg-table);
  }

  &.isCircular {
    border-radius: 10rem;
  }

  &.isDisabled, &.isReadOnly {
    background: none;
    box-shadow: none;
    cursor: not-allowed;
  }

  &.isBusy {
    cursor: wait;
  }

  &.isFull {
    display: block;
    width: 100%;
  }

  &.isIcon {
    background: transparent;
  }

  .ui--Button-spinner {
    visibility: hidden;
  }

  .ui--Button-overlay {
    background: rgba(253, 252, 251, 0.75);
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    visibility: hidden;
  }

  .ui--Icon {
    border-radius: 50%;
    box-sizing: content-box;
    height: 1rem;
    margin: -${ICON_PADDING}rem 0;
    padding: ${ICON_PADDING}rem;
    width: 1rem;
  }

  &.isBusy {
    .ui--Button-spinner {
      visibility: visible;
    }
  }

  &.isDisabled {
    color: #bcbbba;
    svg {
      color: #bcbbba!important;
    }
  }
`);
