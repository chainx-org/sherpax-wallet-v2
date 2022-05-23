import React, {useContext, useEffect, useState} from 'react'
import AssetView from "@polkadot/app-accounts/components/WalletPanel/AssetView";
import {formatBalance} from "@polkadot/util";
import {AccountContext} from "@polkadot/react-components-chainx/AccountProvider";
import {useApi, useLockedBreakdown, useVestedLocked} from "@polkadot/react-hooks";
import BigNumber from "bignumber.js";
import usePcxfree, {PcxFreeInfo} from "@polkadot/react-hooks-chainx/usePcxFree";
import {useTranslation} from "@polkadot/app-accounts/translate";

type Props = {
  lookup:any
}

export default function Balance({lookup}: Props) {
  const { currentAccount } = useContext(AccountContext);
  const [n, setN] = useState(0);
  const [usableBalance, setUsableBalance] = useState<number>(0)
  const [allBalance, setAllBalance] = useState<number>(0)
  const [reserved, setReserved] = useState<number>(0)
  const vestLocked = useVestedLocked(currentAccount, n);
  const [feeFrozen, setFeeFrozen] = useState<number>(0)
  const [miscFrozen, setMiscFrozen] = useState<number>(0)
  const pcxFree = usePcxfree(currentAccount, n);
  const lockedBreakdown: any = useLockedBreakdown(currentAccount, n);


  const { isApiReady } = useApi();
  const {t} = useTranslation()



  const [defaultValue, setDefaultValue] = useState<PcxFreeInfo>({
    free: 0,
    reserved: 0,
    miscFrozen: 0,
    feeFrozen: 0
  })

  function lookupLock(lookup: Record<string, string>, lockId: Raw): string {
    const lockHex = lockId.toHuman() as string;

    try {
      return lookup[lockHex] || lockHex;
    } catch (error) {
      return lockHex;
    }
  }


  useEffect(() => {
    if (!window.localStorage.getItem('pcxFreeInfo')) {
      window.localStorage.setItem('pcxFreeInfo', JSON.stringify(defaultValue))
      // window.localStorage.setItem('redeemV',JSON.stringify(defaultredeemV))
      const bgFree = new BigNumber(defaultValue.free)
      const miscFrozened = defaultValue.miscFrozen


      setUsableBalance(bgFree.minus(new BigNumber(defaultValue.miscFrozen)).toNumber())
      setAllBalance(bgFree.plus(new BigNumber(defaultValue.reserved)).toNumber())
      setReserved((new BigNumber(defaultValue.reserved)).toNumber())
      setFeeFrozen((new BigNumber(defaultValue.feeFrozen)).toNumber())
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
      }
    }

  }, [currentAccount, pcxFree, isApiReady])

  useEffect(() => {
    if (isApiReady && pcxFree) {
      const bgFree = new BigNumber(pcxFree.free)
      const miscFrozened = defaultValue.miscFrozen

      setUsableBalance(bgFree.minus(new BigNumber(pcxFree.miscFrozen)).toNumber())
      setAllBalance(bgFree.plus(new BigNumber(pcxFree.reserved)).toNumber())
      setReserved((new BigNumber(defaultValue.reserved)).toNumber())
      setFeeFrozen((new BigNumber(pcxFree.feeFrozen)).toNumber())
      setMiscFrozen((new BigNumber(miscFrozened)).toNumber())

    } else {
      const bgFree = new BigNumber(defaultValue.free)
      const miscFrozened = defaultValue.miscFrozen

      setUsableBalance(bgFree.minus(new BigNumber(defaultValue.miscFrozen)).toNumber())
      setAllBalance(bgFree.plus(new BigNumber(defaultValue.reserved)).toNumber())
      setReserved((new BigNumber(defaultValue.reserved)).toNumber())
      setFeeFrozen(new BigNumber(defaultValue.feeFrozen).toNumber())
      setMiscFrozen((new BigNumber(miscFrozened)).toNumber())

    }
  }, [defaultValue, isApiReady, pcxFree])


  return (
    <div className='balance'>
      <AssetView
        showDallar
        bold
        key={Math.random()}
        title={t('KSX Balance')}
        value={allBalance}
      />
      <section className='details' key="details">
        {(
          <>
            <AssetView key={Math.random()}    title={t('Transferrable')}  value={usableBalance > 0 ? usableBalance : 0}></AssetView>

            <AssetView
              key={Math.random()}
              title={t('Reserved')}
              value={reserved}
            />

            {lockedBreakdown && <AssetView
              key={Math.random()}
              title={t('Locked')}
              value={Math.max(feeFrozen, miscFrozen)}
              help={Math.max(feeFrozen, miscFrozen)?<p>
                {lockedBreakdown.map(({ amount, id, reasons }, index) => {
                  return (
                    <div key={index}>
                      {amount?.isMax()
                        ? t<string>('everything')
                        : formatBalance(amount, { forceUnit: '-' })
                      }{id && <span style={{ color: 'rgba(0,0,0,0.56)' }}> {lookupLock(lookup, id)}</span>}<span style={{ color: 'rgba(0,0,0,0.56)' }}>{reasons.toString()}</span>
                    </div>
                  )
                })}
              </p>:''}
            />}

          </>
        )}
      </section>
    </div>
  )
}
