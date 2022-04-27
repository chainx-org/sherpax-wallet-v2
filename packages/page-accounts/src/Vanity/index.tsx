// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0
import type { ConstValue } from '@polkadot/react-components/InputConsts/types';
import type { ConstantCodec } from '@polkadot/types/metadata/decorate/types';
// import type { ComponentProps as Props } from '../types';
import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { KeypairType } from '@polkadot/util-crypto/types';
import type { GeneratorMatch, GeneratorMatches, GeneratorResult } from '@polkadot/vanitygen/types';
// import type { Extrinsic } from '@polkadot/types/interfaces';
// import type { DeriveProposalImage } from '@polkadot/api-derive/types';
import type {  Proposal} from '@polkadot/types/interfaces';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
// InputExtrinsic,InputWasm,Forget,Password,  VoteValue,
import { Button, Dropdown, Input, Table, IdentityIcon, InputAddress, InputAddressMulti, InputConsts,  Menu, Modal, Popup, Tabs, AccountName, AddressInfo, AddressMini, AddressRow, AvatarItem, AddressSmall, AddressToggle, Available, Badge, BatchWarning, Bonded, CallExpander, CardSummary, ChainImg, ChainLock, Checkbox, Columar, ConvictionDropdown, CopyButton, CryptoType, Digits, EditButton, Editor, ErrorBoundary, ExpandButton, Expander, FilterInput, FilterOverlay, Flag, HelpOverlay, Icon, IconLink, InfoForInput, InputAddressSimple, InputBalance, InputFile, InputNumber, InputTags,  Inset, Label, LabelHelp, Labelled, LinkExternal, LockedVote, MarkError, MarkWarning, Nonce, Output, ParaLink,  PasswordStrength, Progress, ProposedAction, Row, Sidebar, Spinner, SortDropdown, Static, SummaryBox, Tag, Tags, TextArea, Toggle, ToggleGroup, Tooltip, TxButton, VoteAccount,Extrinsic } from '@polkadot/react-components';
import { useApi, useIsMountedRef } from '@polkadot/react-hooks';
import generator from '@polkadot/vanitygen/generator';
// import matchRegex from '@polkadot/vanitygen/regex';
import generatorSort from '@polkadot/vanitygen/sort';
import { formatNumber } from '@polkadot/util';
import { useTranslation } from '../translate';
import Match from './Match';

interface Props {
  className?: string;
  previousDelegatingAccount?: string;
  onStatusChange: (status: ActionStatus) => void;
  onClose: () => void;
  proposal?: Proposal | null;
  call: any
}

interface Match {
  isMatchValid: boolean;
  match: string;
}

interface Results {
  elapsed: number;
  isRunning: boolean;
  keyCount: number;
  keyTime: number;
  matches: GeneratorMatches;
  startAt: number;
}

const DEFAULT_MATCH = 'Some';
const BOOL_OPTIONS = [
  { text: 'No', value: false },
  { text: 'Yes', value: true }
];

function VanityApp({ className = '', onStatusChange, previousDelegatingAccount, call, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api ,apiDefaultTxSudo} = useApi();
  const results = useRef<GeneratorResult[]>([]);
  const runningRef = useRef(false);
  const mountedRef = useIsMountedRef();
  // const [createSeed, setCreateSeed] = useState<string | null>(null);
  const [{isRunning }, setResults] = useState<Results>({
    elapsed: 0,
    isRunning: false,
    keyCount: -1,
    keyTime: 0,
    matches: [],
    startAt: 0
  });
  const [{ isMatchValid, match }] = useState<Match>({ isMatchValid: true, match: DEFAULT_MATCH });
  const [type, ] = useState<KeypairType>('ed25519');
  const [withCase, setWithCase] = useState(true);
  const [, setDelegatingAccount] = useState<string | null>(previousDelegatingAccount || null);

  // const _clearSeed = useCallback(
  //   () => setCreateSeed(null),
  //   []
  // );

  const [visible, setVisible] = useState(false)
  // const [forgetVisible, setForgetVisible] = useState(false)
  const [siderVisible, setSiderVisible] = useState(false)
  const [, setTextVisible] = useState(false)


  const _checkMatches = useCallback(
    (): void => {
      const checks = results.current;
      results.current = [];
      if (checks.length === 0 || !mountedRef.current) {
        return;
      }

      setResults(
        ({ isRunning, keyCount, keyTime, matches, startAt }: Results): Results => {
          let newKeyCount = keyCount;
          let newKeyTime = keyTime;
          const newMatches = checks.reduce((result, { elapsed, found }): GeneratorMatch[] => {
            newKeyCount += found.length;
            newKeyTime += elapsed;

            return result.concat(found);
          }, matches);

          return {
            elapsed: Date.now() - startAt,
            isRunning,
            keyCount: newKeyCount,
            keyTime: newKeyTime,
            matches: newMatches.sort(generatorSort).slice(0, 25),
            startAt
          };
        }
      );
    },
    [mountedRef]
  );

  const _executeGeneration = useCallback(
    (): void => {
      if (!runningRef.current) {
        return _checkMatches();
      }

      setTimeout((): void => {
        if (mountedRef.current) {
          if (results.current.length === 25) {
            _checkMatches();
          }

          results.current.push(
            generator({ match, runs: 10, ss58Format: api.registry.chainSS58 || 0, type, withCase, withHex: true })
          );

          _executeGeneration();
        }
      }, 0);
    },
    [_checkMatches, api, match, mountedRef, runningRef, type, withCase]
  );

  // const _onChangeMatch = useCallback(
  //   (match: string): void => setMatch({
  //     isMatchValid:
  //       matchRegex.test(match) &&
  //       (match.length !== 0) &&
  //       (match.length < 31),
  //     match
  //   }),
  //   []
  // );

  // const _onRemove = useCallback(
  //   (address: string): void => setResults(
  //     (results: Results): Results => ({
  //       ...results,
  //       matches: results.matches.filter((item) => item.address !== address)
  //     })
  //   ),
  //   []
  // );

  const _toggleStart = useCallback(
    (): void => setResults(
      ({ elapsed, isRunning, keyCount, keyTime, matches, startAt }: Results): Results => ({
        elapsed,
        isRunning: !isRunning,
        keyCount: isRunning ? keyCount : 0,
        keyTime: isRunning ? keyTime : 0,
        matches,
        startAt: isRunning ? startAt : Date.now()
      })
    ),
    []
  );

  useEffect((): void => {
    runningRef.current = isRunning;

    if (isRunning) {
      _executeGeneration();
    }
  }, [_executeGeneration, isRunning]);

  // const header = useMemo(() => [
  //   [t('matches'), 'start', 2],
  //   [t('Evaluated {{count}} keys in {{elapsed}}s ({{avg}} keys/s)', {
  //     replace: {
  //       avg: (keyCount / (elapsed / 1000)).toFixed(3),
  //       count: keyCount,
  //       elapsed: (elapsed / 1000).toFixed(2)
  //     }
  //   }), 'start'],
  //   [t('secret'), 'start'],
  //   []
  // ], [elapsed, keyCount, t]);


  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'contracts',
      text: t('Contracts')
    }
  ]);


  const [defaultValue] = useState<ConstValue>((): ConstValue => {
    const section = Object.keys(api.consts)[0];
    const method = Object.keys(api.consts[section])[0];

    return {
      meta: (api.consts[section][method] as ConstantCodec).meta,
      method,
      section
    };
  });
  const [, setValue] = useState(defaultValue);

  // const preimage = useCall<DeriveProposalImage>(api.derive.democracy.preimage, [value]);

  

  return (
    <div className={className}>
      {/* <div className='ui--row'>
        <Input
          autoFocus
          className='medium'
          help={t<string>('Type here what you would like your address to contain. This tool will generate the keys and show the associated addresses that best match your search. ')}
          isDisabled={isRunning}
          isError={!isMatchValid}
          label={t<string>('Search for')}
          onChange={_onChangeMatch}
          onEnter={_toggleStart}
          value={match}
        />
        <Dropdown
          className='medium'
          help={t<string>('Should the search be case sensitive, e.g if you select "no" your search for "Some" may return addresses containing "somE" or "sOme"...')}
          isDisabled={isRunning}
          label={t<string>('case sensitive')}
          onChange={setWithCase}
          options={BOOL_OPTIONS}
          value={withCase}
        />
      </div>
      <div className='ui--row'>
        <Dropdown
          className='medium'
          defaultValue={type}
          help={t<string>('Determines what cryptography will be used to create this account. Note that to validate on Polkadot, the session account must use "ed25519".')}
          label={t<string>('keypair crypto type')}
          onChange={setType}
          options={isEthereum ? settings.availableCryptosEth : settings.availableCryptos}
        />
      </div>
    
      <Button.Group>
        <Button
          icon={
            isRunning
              ? 'stop'
              : 'sign-in-alt'
          }
          isDisabled={!isMatchValid}
          label={
            isRunning
              ? t<string>('Stop generation')
              : t<string>('Start generation')
          }
          onClick={_toggleStart}
        />
      </Button.Group> */}

      <div>Button
        <div style={{ marginLeft: '80px' }}>
          <Button
            icon={
              isRunning
                ? 'stop'
                : 'sign-in-alt'
            }
            isDisabled={!isMatchValid}
            label={
              isRunning
                ? t<string>('Stop generation')
                : t<string>('Start generation')
            }
            onClick={_toggleStart}
          />
        </div>
      </div>
      <br />

      <div> IdentityIcon
        <div style={{ marginLeft: '80px' }}>
          <IdentityIcon
            size={40}
            value={'5UzmGBgdiLXBiChZCPh4PJarnwxDMZLbNaANEpi4zHkdnDDP'}
          />
        </div>
      </div>
      <br />

      <div>InputAddress
        <InputAddress
          label={t<string>('delegating account')}
          onChange={setDelegatingAccount}
          type='account'
          value={'5UzmGBgdiLXBiChZCPh4PJarnwxDMZLbNaANEpi4zHkdnDDP'}
        />
      </div>
      <br />

      <div>InputAddressMulti
        <InputAddressMulti
          available={['5UzmGBgdiLXBiChZCPh4PJarnwxDMZLbNaANEpi4zHkdnDDP', '5PvKmxAuznR4rJc9sNEC8rA4dnHQeeh1fvA2dTPt7q2zUGJr']}
          availableLabel={t<string>('Applying list')}
          onChange={setDelegatingAccount}
          maxCount={10}
          valueLabel={t<string>('Ready to send a withdrawal request')}
        />
      </div>
      <br />

      <div>InputConsts
        <InputConsts
          defaultValue={defaultValue}
          // help={meta?.docs.join(' ')}
          label={t<string>('selected constant query')}
          onChange={setValue}
        />
      </div>
      <br />

      {/* <div>InputExtrinsic
        <InputExtrinsic
          defaultValue={defaultValue}
          isDisabled
          label={t<string>('decoded call')}
        />
      </div>
      <br /> */}

      <div>Menu &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Popup弹出的111即为Menu组件
      </div>
      <br />

      <div>Modal &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button className='myButton' onClick={() => setVisible(true)}>Modal按钮</button>
        {visible && <Modal
          className='app--accounts-Modal'
          header={t<string>('Modal text')}
          onClose={() => setVisible(false)}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <BatchWarning />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <Button
              icon='download'
              isDisabled={false}
              label={t<string>('Download')}
            />
          </Modal.Actions>
        </Modal>}
      </div>

      <div>Popup &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Popup
          className={`name`}
          isDisabled={false}
          value={
            <Menu>
              {'111'}
            </Menu>
          }
        />
      </div>
      <br />

      <div>Table
        <Table>
          <tr>
            <td>1111</td>
            <td>2222</td>
            <td>3333</td>
            <td>4444</td>
            <td>5555</td>
          </tr>
          <tr>
            <td>二行一列</td>
            <td>二行二列</td>
            <td>二行三列</td>
            <td>二行四列</td>
            <td>二行五列</td>
          </tr>
        </Table>
      </div>
      <br />

      <div> Tabs
        <Tabs
          basePath={'5UzmGBgdiLXBiChZCPh4PJarnwxDMZLbNaANEpi4zHkdnDDP'}
          items={itemsRef.current}
        />
      </div>
      <br />

      <div> AccountName &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <AccountName
          value={'5UzmGBgdiLXBiChZCPh4PJarnwxDMZLbNaANEpi4zHkdnDDP'}
          withSidebar
        >
        </AccountName>
      </div>
      <br />

      <div> AddressInfo 传值
        <AddressInfo
          address={'5UzmGBgdiLXBiChZCPh4PJarnwxDMZLbNaANEpi4zHkdnDDP'}
          // balancesAll={balancesAll}
          withBalance={{
            available: false,
            bonded: false,
            locked: false,
            redeemable: false,
            reserved: false,
            total: true,
            unlocking: false,
            vested: false
          }}
        />
      </div>
      <br />

      <div> AddressMini &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <AddressMini
          value={'5UzmGBgdiLXBiChZCPh4PJarnwxDMZLbNaANEpi4zHkdnDDP'}
          withSidebar={false}
        />
      </div>
      <br />

      <div> AddressRow
        <div style={{ marginLeft: '80px' }}>
          <AddressRow
            isInline
            value={'5UzmGBgdiLXBiChZCPh4PJarnwxDMZLbNaANEpi4zHkdnDDP'}
          >
          </AddressRow>
        </div>
      </div>
      <br />

      <div> AddressSmall
        <div style={{ marginLeft: '80px' }}>
          <AddressSmall
            // parentAddress={meta.parentAddress}
            value={'5UzmGBgdiLXBiChZCPh4PJarnwxDMZLbNaANEpi4zHkdnDDP'}
            withShortAddress
          />
        </div>
      </div>
      <br />

      <div> AddressToggle
        <div style={{ marginLeft: '80px' }}>
          <AddressToggle
            address={'5UzmGBgdiLXBiChZCPh4PJarnwxDMZLbNaANEpi4zHkdnDDP'}
            // filter={filter}
            noToggle
          // onChange={_onSelect}
          />
        </div>
      </div>
      <br />

      <div> Available
        <div style={{ marginLeft: '80px' }}>
          <Available
            label={t<string>('transferrable')}
            params={'5UzmGBgdiLXBiChZCPh4PJarnwxDMZLbNaANEpi4zHkdnDDP'}
          />
        </div>

      </div>
      <br />

      <div> AvatarItem
        <div style={{ marginLeft: '80px' }}>
          <AvatarItem
            icon={'plus'}
            subtitle={'测试'}
            title={'年后'}
          />
        </div>
      </div>
      <br />

      <div> Badge
        <div style={{ marginLeft: '80px' }}>
          <Badge
            color={'red'}
            info={10}
          />
        </div>
      </div>
      <br />

      {/* <div> BatchWarning
      <BatchWarning />
      </div>
      <br /> */}

      <div> Bonded
        <div style={{ marginLeft: '80px' }}>
          <Bonded
            className={`ui--Bonded ${className}`}
            label={<p>样式</p>}
            params={'5UzmGBgdiLXBiChZCPh4PJarnwxDMZLbNaANEpi4zHkdnDDP'}
          />
        </div>
      </div>
      <br />

      <div>CallExpander  传值
        <CallExpander value={call} />
      </div>
      <br />

      {/* <div> Card  我们发现了这个 Polkadot 地址的预声明。 但是，证明需要使用此帐户进行签名。 要继续证明，请先将此帐户添加为自有帐户。
        <Card isError>
        <div className={className}>
          {t<string>('We found a pre-claim with this Polkadot address. However, attesting requires signing with this account. To continue with attesting, please add this account as an owned account first.')}
          <h3>
          </h3>
        </div>
      </Card>
      </div>
      <br /> */}

      <div> CardSummary
        <CardSummary label={t<string>('redeemable')}>
          {/* <FormatBalance value={balance.redeemable} /> */}
          <p>测试数据</p>
        </CardSummary>
      </div>
      <br />

      <div > ChainImg
        <div style={{ width: '50px', marginLeft: '80px' }}>
          <ChainImg
            className='ui--Dropdown-icon'
            logo={'100'}
          />
        </div>
      </div>
      <br />

      <div> ChainLock
        <ChainLock
          className='accounts--network-toggle'
          genesisHash={'aaa'}
          key='chainlock'
          onChange={'aa'}
        />
      </div>
      <br />

      <div> Checkbox
        <div style={{ marginLeft: '80px' }}>
          <Checkbox
            label={<>{t<string>('Use custom address index')}</>}
            onChange={'aa'}
            value={'222'}
          />
        </div>
      </div>
      <br />

      <div> Columar
        <div style={{ marginLeft: '80px' }}>
          <Columar>
            <Columar.Column>
              {/* <InputAddress
          defaultValue={address}
          label={t<string>('address {{index}}', { replace: { index: index + 1 } })}
          onChange={_setAddress}
        /> */}
              <p>测试样式</p>
            </Columar.Column>
          </Columar>
        </div>
      </div>
      <br />

      <div>ConvictionDropdown
        <div>
          <ConvictionDropdown
            help={t<string>('The conviction to use for this vote, with an appropriate lock period.')}
            label={t<string>('conviction')}
            // onChange={setConviction}
            value={111}
          />
        </div>
      </div>
      <br />

      <div>CopyButton
        <div style={{ marginLeft: '80px' }}>
          <CopyButton
            label={t<string>('Share')}
            type={t<string>('url')}
            value={12345}
          />
        </div>
      </div>
      <br />

      <div>CryptoType
        <div style={{ marginLeft: '80px' }}>
          <CryptoType accountId={'5UzmGBgdiLXBiChZCPh4PJarnwxDMZLbNaANEpi4zHkdnDDP'} />
        </div>
      </div>
      <br />

      <div>Digits
        <div style={{ marginLeft: '80px' }}>
          <Digits value={formatNumber(1233214124124)} />
        </div>
      </div>
      <br />

      <div> Dropdown
        <div>
          <Dropdown
            className='medium'
            help={t<string>('Should the search be case sensitive, e.g if you select "no" your search for "Some" may return addresses containing "somE" or "sOme"...')}
            isDisabled={isRunning}
            label={t<string>('case sensitive')}
            onChange={setWithCase}
            options={BOOL_OPTIONS}
            value={withCase}
          />
        </div>
      </div>
      <br />

      <div>EditButton
        <div style={{ marginLeft: '80px' }}>
          <EditButton onClick={'1'}>
            <p>EditButton测试数据</p>
          </EditButton>
        </div>
      </div>
      <br />

      <div> Editor
        <div style={{ height: '50px' }}>
          <Editor
            className='editor'
            code={'3'}
            isValid={'2'}
            onEdit={'1'}
          />
        </div>
      </div>
      <br />

      <div>ErrorBoundary
        <div style={{ marginLeft: '80px' }}>
          <ErrorBoundary trigger={name}>
            <p>ErrorBoundary测试数据</p>
          </ErrorBoundary>
        </div>
      </div>
      <br />

      <div>ExpandButton
        <div style={{ marginLeft: '80px' }}>
          <ExpandButton
            expanded={'11'}
            onClick={'aaa'}
          />
        </div>
      </div>
      <br />

      <div>Expander
        <div style={{ marginLeft: '80px' }}>
          <Expander summary={'summary'}>
            <p>测试数据</p>
          </Expander>
        </div>
      </div>
      <br />

      <div> Extrinsic
        <div>
          <Extrinsic
            className={className}
            defaultValue={apiDefaultTxSudo}
            isDisabled={false}
            isError={false}
            isPrivate={false}
            label={t<string>('proposal')}
            onChange={()=>setTextVisible(false)}
          />
        </div>
      </div>
      <br />

      <div>FilterInput
        <div style={{ marginLeft: '80px' }}>
          <FilterInput
            filterOn={'a'}
            label={t<string>('filter by name or tags')}
            setFilter={'11'}
          />
        </div>
      </div>
      <br />

      <div>FilterOverlay &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;右上角的问号旁边FilterOverlay
        <div>
          <FilterOverlay className={`text`}>
            <p>FilterOverlay</p>
          </FilterOverlay>
        </div>
      </div>
      <br />

      <div>Flag
        <div style={{ marginLeft: '80px' }}>
          <Flag
            color='theme'
            label={t<string>('Validator')}
          />
        </div>
      </div>
      <br />

      {/* <div>Forget 弹出框&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button className='myButton' onClick={() => setForgetVisible(true)}>Forget按钮</button>
        {forgetVisible &&
          <Forget
            key='modal-forget-account'
            mode='code'
            onClose={() => setForgetVisible(false)}
            onForget={1}
          >
            <p>Forget测试数据</p>
          </Forget>}
      </div>
      <br /> */}

      <div>HelpOverlay &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;右上角的问号
        <div>
          <HelpOverlay md={'aaa' as string} />
        </div>
      </div>
      <br />

      <div>Icon
        <div style={{ marginLeft: '80px' }}>
          <Icon
            className='dropdown'
            icon={'caret-right'}
          />
        </div>
      </div>
      <br />

      <div>IconLink
        <div style={{ marginLeft: '80px' }}>
          <IconLink
            // href={imageLink}
            icon='braille'
            label={name}
            rel='noopener'
            target='_blank'
          />
        </div>
      </div>
      <br />

      <div>InfoForInput
        <div style={{ marginLeft: '80px' }}>
          <InfoForInput type='error'>
            {/* {isAddress
              ? t<string>('Unable to find deployed contract code at the specified address')
              : t<string>('The value is not in a valid address format')
            } */}
            <p>Unable to find deployed contract code at the specified address</p>
          </InfoForInput>
        </div>
      </div>
      <br />

      <div>Input
        <div>
          <Input
            help={t<string>(
              'You can set a custom derivation path for this account using the following syntax "m/<purpose>/<coin_type>/<account>/<change>/<address_index>'
            )}
            // isError={!!deriveValidation?.error}
            label={t<string>('secret derivation path')}
            // onChange={onChange}
            // placeholder={ETH_DEFAULT_PATH}
            tabIndex={-1}
            value={'add'}
          />
        </div>
      </div>
      <br />

      <div>InputAddressSimple
        <div>
          <InputAddressSimple
            className='staking--queryInput'
            defaultValue={'5UzmGBgdiLXBiChZCPh4PJarnwxDMZLbNaANEpi4zHkdnDDP'}
            help={t<string>('Display overview information for the selected validator, including blocks produced.')}
            label={t<string>('validator to query')}
          // onChange={setValidatorId}
          // onEnter={_onQuery}
          >
            {/* <Button
          icon='play'
          isDisabled={false}
          // onClick={_onQuery}
        /> */}
          </InputAddressSimple>
        </div>
      </div>
      <br />

      <div>InputBalance
        <div>
          <InputBalance
            defaultValue={1}
            isDisabled
            label={t<string>('reserved balance')}
          />
        </div>
      </div>
      <br />

      <div>InputFile
        <div>
          <InputFile
            help={t<string>('The compiled WASM for the contract that you wish to deploy. Each unique code blob will be attached with a code hash that can be used to create new instances.')}
            isError={false}
            label={t<string>('compiled contract WASM')}
          // onChange={_onAddWasm}
          // placeholder={wasm && !isWasmValid && t<string>('The code is not recognized as being in valid WASM format')}
          />
        </div>
      </div>
      <br />

      <div>InputNumber
        <div>
          <InputNumber
            help={t<string>('The threshold for this multisig')}
            isError={false}
            label={t<string>('threshold')}
          // onChange={_onChangeThreshold}
          // value={}
          />
        </div>
      </div>
      <br />

      <div>InputTags
        <div>
          <InputTags
            // defaultValue={value}
            // onBlur={_onSave}
            // onChange={onChange}
            // onClose={_onSave}
            openOnFocus
            searchInput={{ autoFocus: false }}
            // value={value}
            withLabel={false}
          />
        </div>
      </div>
      <br />

      {/* <div>InputWasm
        <div>
          <InputWasm
            help={t<string>('The compiled runtime WASM for the parachain you wish to register.')}
            isError={false}
            label={t<string>('validation code')}
            // onChange={_setWasm}
            placeholder={t<string>('The code is not recognized as being in valid WASM format')}
          />
        </div>
      </div>
      <br /> */}

      <div>Inset
        <div>
          <Inset className={className}>
            <div>Inset测试数据</div>
          </Inset>
        </div>
      </div>
      <br />

      <div>Label
        <div style={{ marginLeft: '80px' }}>
          <Label label={t<string>('transactions')} />
        </div>
      </div>
      <br />

      <div>LabelHelp
        <div style={{ marginLeft: '80px' }}>
          <LabelHelp
            help={'测试'}
          // icon={helpIcon}
          />
        </div>
      </div>
      <br />

      <div>Labelled
        <div style={{ marginLeft: '80px' }}>
          <Labelled
            className='small'
            label={t<string>('with an index of')}
          >
          </Labelled>
        </div>
      </div>
      <br />
      <br />

      <div>LinkExternal  传值
        <div>
          <LinkExternal
            className='ui--AddressCard-exporer-link media--1400'
            data={'5UzmGBgdiLXBiChZCPh4PJarnwxDMZLbNaANEpi4zHkdnDDP'}
            isLogo
            type='address'
          />
        </div>
      </div>
      <br />

      <div>LockedVote  传值
        <div>
          <LockedVote
            className={`ui--LockedVote ${className}`}
            label={t<string>('with an index of')}
            params={'11'}
          />
        </div>
      </div>
      <br />

      <div>MarkError
        <div>
          <MarkError content={'error'} />
        </div>
      </div>
      <br />

      <div>MarkWarning
        <div>
          <MarkWarning content={<>{t<string>('Consider storing your account in a signer such as a browser extension, hardware device, QR-capable phone wallet (non-connected) or desktop application for optimal account security.')}&nbsp;{t<string>('Future versions of the web-only interface will drop support for non-external accounts, much like the IPFS version.')}</>} />
        </div>
      </div>
      <br />

      <div>Output
        <div>
          <Output
            className={className}
            isDisabled
            label={t<string>('with an index of')}
          >
          </Output>
        </div>
      </div>
      <br />

      <div>Nonce
        <div>
          <Nonce
            // callOnResult={setAccountNonce}
            className='ui disabled dropdown selection'
            params={'5UzmGBgdiLXBiChZCPh4PJarnwxDMZLbNaANEpi4zHkdnDDP'}
          />
        </div>
      </div>
      <br />

      <div>ParaLink
        <div>
          <ParaLink id={'122'} />
        </div>
      </div>
      <br />

      {/* <div>Password
        <div>
          <Password
            autoFocus
            help={t<string>('The existing account password as specified when this account was created or when it was last changed.')}
            isError={false}
            label={t<string>('your current password')}
            // onChange={_onChangeOld}
            tabIndex={1}
          // value={oldPass}
          />
        </div>
      </div>
      <br /> */}

      <div>PasswordStrength
        <div>
          <PasswordStrength value={'111'} />
        </div>
      </div>
      <br />

      <div>Progress
        <div style={{ marginLeft: '80px' }}>
          <Progress
            className='progress'
            progress={'a'}
          />
        </div>
      </div>
      <br />

      <div>ProposedAction
        <div style={{ marginLeft: '80px' }}>
          <ProposedAction
            idNumber={'12'}
          // proposal={proposal}
          />
        </div>
      </div>
      <br />

      <div>Row
        <div style={{ marginLeft: '80px' }}>
          <Row
            // buttons={buttons}
            className={className}
            icon={
              <div className='ui--CodeRow-icon'>
                <Icon icon='code' />
              </div>
            }
            // isInline={isInline}
            name={name}
          // onChangeName={setName}
          // onChangeTags={setTags}
          // onSaveName={_onSaveName}
          // onSaveTags={_onSaveTags}
          // tags={withTags && tags}
          >
          </Row>

        </div>
      </div>
      <br />

      <div>Sidebar 弹出框&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button className='myButton' onClick={() => setSiderVisible(true)}>Sidebar按钮</button>
        {siderVisible &&
          <Sidebar
            address={'5UzmGBgdiLXBiChZCPh4PJarnwxDMZLbNaANEpi4zHkdnDDP'}
            dataTestId='account-sidebar'
            onClose={()=>{setSiderVisible(false)}}
            onUpdateName={'1'}
          />}
      </div>
      <br />

      <div>SortDropdown
        <div style={{ marginLeft: '80px' }}>
          <SortDropdown
            defaultValue={'1'}
            label={t<string>('sort by')}
          // onChange={onDropdownChange()}
          // onClick={onSortDirectionChange()}
          // options={dropdownOptions()}
          // sortDirection={sortFromMax ? 'ascending' : 'descending'}
          />
        </div>
      </div>
      <br />

      <div>Spinner
        <div>
          <Spinner label={t<string>('Retrieving sub-identities')} />
        </div>
      </div>
      <br />

      <div>Static
        <div>
          <Static
            help={t<string>('The bonding duration for any staked funds. After this period needs to be withdrawn.')}
            label={t<string>('on-chain bonding duration')}
          >
            {/* <BlockToTime value={bondedBlocks} /> */}
          </Static>
        </div>
      </div>
      <br />

      <div>SummaryBox
        <div style={{ marginLeft: '80px' }}>
          <SummaryBox className={className}>
            <p>SummaryBox测试数据</p>
          </SummaryBox>
        </div>
      </div>
      <br />

      <div>Tag
        <div style={{ marginLeft: '80px' }}>
          <Tag
            color='green'
            label={t<string>('society head')}
          />
        </div>
      </div>
      <br />

      <div>Tags
        <div style={{ marginLeft: '80px' }}>
          <Tags
            value={['1', '2']}
            withTitle
          />
        </div>
      </div>
      <br />

      <div>TextArea
        <div>
          <TextArea
            help={t<string>("Your ethereum key pair is derived from your private key. Don't divulge this key.")}
            isAction
            isError={false}
            withLabel
          >
          </TextArea>
        </div>
      </div>
      <br />

      <div>Toggle
        <div style={{ marginLeft: '80px' }}>
          <Toggle
            isOverlay
            label={t<string>('include field')}
            // onChange={onChange}
            value={'1'}
          />
        </div>
      </div>
      <br />
      <br />

      <div>ToggleGroup  传值
        <div>
          <ToggleGroup
            onChange={'5UzmGBgdiLXBiChZCPh4PJarnwxDMZLbNaANEpi4zHkdnDDP'}
            options={'1234'}
            value={'3'}
          />
        </div>
      </div>
      <br />

      <div>Tooltip  传值
        <div>
          <Tooltip
            text={
              <>
                <div>
                  <div className='faded'>{t('available to be unlocked')}</div>
                </div>
              </>
            }
            trigger={`${'5UzmGBgdiLXBiChZCPh4PJarnwxDMZLbNaANEpi4zHkdnDDP'}-vested-trigger`}
          />
        </div>
      </div>
      <br />

      <div>TxButton
        <div style={{ marginLeft: '80px' }}>
          <TxButton
            accountId={'5UzmGBgdiLXBiChZCPh4PJarnwxDMZLbNaANEpi4zHkdnDDP'}
            icon='trash-alt'
            label={t<string>('Undelegate')}
            onStart={onClose}
            tx={api.tx.democracy.undelegate}
          />
        </div>
      </div>
      <br />

      <div>VoteAccount
        <div style={{ marginLeft: '80px' }}>
          <VoteAccount onChange={setDelegatingAccount} />
        </div>
      </div>
      <br />

      {/* <div>VoteValue
        <div style={{ marginLeft: '80px' }}>
          <VoteValue
            accountId={'5UzmGBgdiLXBiChZCPh4PJarnwxDMZLbNaANEpi4zHkdnDDP'}
            isCouncil
            onChange={setDelegatingAccount}
          />
        </div>
      </div>
      <br /> */}


      {/* {matches.length !== 0 && (
        <>
          <article className='warning centered'>{t<string>('Ensure that you utilized the "Save" functionality before using a generated address to receive funds. Without saving the address and the associated seed any funds sent to it will be lost.')}</article>
          <Table
            className='vanity--App-matches'
            empty={t<string>('No matches found')}
            header={header}
          >
            {matches.map((match): React.ReactNode => (
              <Match
                {...match}
                key={match.address}
                onCreateToggle={setCreateSeed}
                onRemove={_onRemove}
              />
            ))}
          </Table>
        </>
      )}
      {createSeed && (
        <CreateModal
          onClose={_clearSeed}
          onStatusChange={onStatusChange}
          seed={createSeed}
          type={type}
        />
      )} */}

    </div>
  );
}

export default React.memo(styled(VanityApp)`
  .vanity--App-matches {
    overflow-x: auto;
    padding: 1em 0;
  }

  .vanity--App-stats {
    padding: 1em 0 0 0;
    opacity: 0.45;
    text-align: center;
  }
`);
