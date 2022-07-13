// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useDebounce, useLoadingDelay } from '@polkadot/react-hooks';

import Input from '../Input';
import Spinner from '../Spinner';
import { useTranslation } from '../translate';
import Available from './Available';
import Selected from './Selected';

interface Props {
  available: string[];
  availableLabel: React.ReactNode;
  className?: string;
  defaultValue?: ISelectValue[];
  help: React.ReactNode;
  maxCount: number;
  onChange: (values: ISelectValue[]) => void;
  valueLabel: React.ReactNode;
}

interface ISelectValue {
  addr:string,
  index:number
}

function exclude (prev: ISelectValue[], address: string,idx:number) {

  return prev.map((item,index) => {
    if(item.addr !== address && idx !== index) {
      return item
    }
    return null
  }).filter(item => item)
}

function include (prev: ISelectValue[], address: string, maxCount: number,index:number): ISelectValue[] {
  // return !prev?.addr.includes(address) && (prev.length < maxCount)
  //   ? prev.concat(address)
  //   : prev;
  return prev.length < maxCount ? [...prev,{addr:address,index}] : prev
}


function InputAddressMulti ({ available, availableLabel, className = '', defaultValue, maxCount, onChange, valueLabel }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [_filter, setFilter] = useState<string>('');
  const [selected, setSelected] = useState<ISelectValue[]>([]);
  const filter = useDebounce(_filter);
  const isLoading = useLoadingDelay();

  useEffect((): void => {
    defaultValue && setSelected(defaultValue);
  }, [defaultValue]);

  useEffect((): void => {
    selected && onChange(selected);
  }, [onChange, selected]);

  const _onSelect = useCallback(
    (address: string,index:number) => {
      return setSelected((prev) => include(prev, address, maxCount,index))
    },
    [maxCount]
  );

  const _onDeselect = useCallback(
    (address: string,index:number) => {
      return setSelected((prev) => exclude(prev, address,index))
    },
    []
  );

  const isHiddenAvailable = useCallback((address:string,index:number) => !!selected.filter(item => item.addr === address && item.index === index).length,[selected])

  return (
    <div className={`ui--InputAddressMulti ${className}`}>
      <Input
        autoFocus
        className='ui--InputAddressMulti-Input'
        isSmall
        onChange={setFilter}
        placeholder={t<string>('filter by name, address, or account index')}
        value={_filter}
        withLabel={false}
      />
      <div className='ui--InputAddressMulti-columns'>
        <div className='ui--InputAddressMulti-column'>
          <label>{valueLabel}</label>
          <div className='ui--InputAddressMulti-items'>
            {selected.map((select): React.ReactNode => (
              <Selected
                address={select.addr}
                index={select.index}
                key={select.index}
                onDeselect={_onDeselect}
              />
            ))}
          </div>
        </div>
        <div className='ui--InputAddressMulti-column'>
          <label>{availableLabel}</label>
          <div className='ui--InputAddressMulti-items'>
            {isLoading
              ? <Spinner />
              : available.map((address,index) => (
                <Available
                  index={index}
                  address={address}
                  filter={filter}
                  isHidden={isHiddenAvailable(address,index)}
                  key={index}
                  onSelect={_onSelect}
                />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(styled(InputAddressMulti)`
  border-top-width: 0px;
  margin-left: 2rem;
  width: calc(100% - 2rem);

  .ui--InputAddressMulti-Input {
    .ui.input {
      margin-bottom: 0.25rem;
      opacity: 1 !important;
    }
  }

  .ui--InputAddressMulti-columns {
    display: inline-flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    width: 100%;

    .ui--InputAddressMulti-column {
      display: flex;
      flex-direction: column;
      min-height: 15rem;
      max-height: 15rem;
      width: 50%;
      padding: 0.25rem 0.5rem;

      .ui--InputAddressMulti-items {
        padding: 0.5rem 0;
        background: var(--bg-input);
        border: 1px solid var(--border-input);
        border-radius: 0.286rem 0.286rem;
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;

        .ui--Spinner {
          margin-top: 2rem;
        }

        .ui--AddressToggle {
          padding-left: 0.75rem;
        }

        .ui--AddressMini-address {
          min-width: auto;
          max-width: 100%;
        }

        .ui--AddressMini-info {
          max-width: 100%;
        }
      }
    }
  }
`);
