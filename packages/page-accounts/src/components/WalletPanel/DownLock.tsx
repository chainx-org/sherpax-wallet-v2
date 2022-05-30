// [object Object]
// SPDX-License-Identifier: Apache-2.0

import React, {useState,useContext,useEffect} from 'react';
import AssetView from "@polkadot/app-accounts/components/WalletPanel/AssetView";
import {useTranslation} from "@polkadot/app-accounts/translate";
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import { formatBalance, formatNumber } from '@polkadot/util';
import { BlockToTime } from '@polkadot/react-query';
import {
  useBestNumber,
  useBalancesAll,
  useVestedLocked,
  useVestClaim,
  useApi,
  useLockedBreakdown,
  useLocked
} from '@polkadot/react-hooks';
import BigNumber from "bignumber.js";
import  {PcxFreeInfo} from "@polkadot/react-hooks-chainx/usePcxFree";
import usePcxFree from '@polkadot/react-hooks-chainx/usePcxFree';



type Props = {
  className:any
}

export default function DownLock ({className}: Props) {
  const {t} = useTranslation()
  const [n, setN] = useState(0);
  const [vest,setVest]=useState<number>(0)
  const [feeFrozen, setFeeFrozen] = useState<number>(0)
  const [miscFrozen, setMiscFrozen] = useState<number>(0)
  const { currentAccount } = useContext(AccountContext);
  const vestClaim = useVestClaim(currentAccount, n);
  const vestLocked = useVestedLocked(currentAccount, n);
  const bestNumber: any = useBestNumber(currentAccount, n);
  const balancesAll = useBalancesAll(currentAccount, n);
  const pcxFree = usePcxFree(currentAccount, n);
  const { isApiReady } = useApi();
  const lockedBreakdown = useLockedBreakdown(currentAccount, n);

  const locked = useLocked(currentAccount,n)
  const democracyData:any = locked.filter((item:any) => item.id === 'democrac')
  const ksxPhreData:any = locked.filter((item:any) => item.id === "ksx/phre")

  const [defaultValue, setDefaultValue] = useState<PcxFreeInfo>({
    free: 0,
    reserved: 0,
    miscFrozen: 0,
    feeFrozen: 0
  })



  useEffect(() => {
    if (!window.localStorage.getItem('pcxFreeInfo')) {
      window.localStorage.setItem('pcxFreeInfo', JSON.stringify(defaultValue))
      // window.localStorage.setItem('redeemV',JSON.stringify(defaultredeemV))
      const bgFree = new BigNumber(defaultValue.free)
      setFeeFrozen((new BigNumber(defaultValue.feeFrozen)).toNumber())
      // const miscFrozened = defaultValue.miscFrozen - window.localStorage.getItem('redeemV')
      const miscFrozened = defaultValue.miscFrozen
      setMiscFrozen((new BigNumber(miscFrozened)).toNumber())
    } else {
      setDefaultValue(JSON.parse(window.localStorage.getItem('pcxFreeInfo')))
      // setDefaultredeemV(JSON.parse(window.localStorage.getItem('redeemV')))
      if (pcxFree) {
        window.localStorage.setItem('pcxFreeInfo', JSON.stringify({
          free: pcxFree.free,
          reserved: pcxFree.reserved,
          miscFrozen: pcxFree.miscFrozen,
          feeFrozen: pcxFree.feeFrozen
        }))
        // window.localStorage.setItem('redeemV', JSON.stringify(redeemV))
      }
    }

  }, [currentAccount, pcxFree, isApiReady])

  useEffect(() => {
    if (isApiReady && pcxFree) {
      const bgFree = new BigNumber(pcxFree.free)
      setFeeFrozen((new BigNumber(pcxFree.feeFrozen)).toNumber())
      // const miscFrozened = defaultValue.miscFrozen - window.localStorage.getItem('redeemV')
      const miscFrozened = defaultValue.miscFrozen
      setMiscFrozen((new BigNumber(miscFrozened)).toNumber())
    } else {
      const bgFree = new BigNumber(defaultValue.free)
      setFeeFrozen(new BigNumber(defaultValue.feeFrozen).toNumber())
      // const miscFrozened = defaultValue.miscFrozen - window.localStorage.getItem('redeemV')
      const miscFrozened = defaultValue.miscFrozen
      setMiscFrozen((new BigNumber(miscFrozened)).toNumber())
    }

  }, [defaultValue, isApiReady, pcxFree])

  useEffect(()=>{
    if(isApiReady && vestLocked){
      setVest(vestLocked)
    }
  },[isApiReady,vestLocked])



  return (
    <div className={className}>
      <div className="flex">
        <AssetView
          vesting={{currentAccount,feeFrozen,miscFrozen,setN}}
          className="small-px left22-5"
          key={Math.random()}
          title={t('Vested')}
          value={vest}
          unLock
          event="vesting.vest"
          help={Math.max(feeFrozen, miscFrozen) ? <div className="left22-5">
            <p style={{ fontSize: '15px',marginBottom:"10px" }}> {formatBalance(vestClaim, { forceUnit: '-' })}<span style={{ color: 'white' }}> available to be unlocked</span></p>
            {balancesAll && balancesAll.map(({ endBlock, locked, perBlock, vested }, index) => {
              return (
                <div
                  className='inner'
                  key={`item:${index}`}
                  style={{lineHeight:"25px"}}
                >
                  {/*<p style={{ lineHeight: '12px' }}>&nbsp;</p>*/}
                  <p>{formatBalance(vested, { forceUnit: '-' })}<span style={{ color: 'white' }}> {t(' of {{locked}} vested', { replace: { locked: formatBalance(locked, { forceUnit: '-' }) } })}</span></p>
                  <span><span style={{ color: 'white' }}>{bestNumber && balancesAll && <BlockToTime blocks={endBlock.sub(bestNumber)} ><span style={{ color: 'white' }}> until block {formatNumber(endBlock)}</span></BlockToTime>}</span></span>
                  <p><span style={{ marginBottom: '5px' }}>{formatBalance(perBlock)}</span><span style={{ color: 'white' }}> per block</span> </p>
                </div>
              )
            })}
          </div> : ''}
        />
        <AssetView unLock event="elections.removeVoter" vesting={{currentAccount,feeFrozen,miscFrozen,setN}} className="small-px fonts-14"  key={Math.random()}  title={t('Elections')}  value={ksxPhreData[0]?.amount} ></AssetView>
        <AssetView className="small-px fonts-14 left21-5"  key={Math.random()}  title={t('Democracy')}  value={democracyData[0]?.amount}  help={<div>Call democracy.removeVote() to cancel the referendum vote, then call democracy.unlock() to unlock it.</div>}></AssetView>
      </div>
    </div>
  );
}
