import React, {createContext, FC, useContext, useEffect, useState} from 'react';
import {useApi, useLockedBreakdown, useVestedLocked} from "@polkadot/react-hooks";
import usePcxfree, {PcxFreeInfo} from "@polkadot/react-hooks-chainx/usePcxFree";
import BigNumber from "bignumber.js";
import {AccountContext} from "./AccountProvider";


export const KSXBalanceContext = createContext({});

export const KSXBalanceProvider: FC = ({ children }) => {
  //获取总量ksx逻辑复制过来的
  const {currentAccount} = useContext(AccountContext)

  const [n, setN] = useState(0);
  const [allKsxBalance, setAllKsxBalance] = useState<number>(0)
  const pcxFree = usePcxfree(currentAccount, n);
  const { isApiReady } = useApi();


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
      setAllKsxBalance(bgFree.plus(new BigNumber(defaultValue.reserved)).toNumber())
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
      setAllKsxBalance(bgFree.plus(new BigNumber(pcxFree.reserved)).toNumber())
    } else {
      const bgFree = new BigNumber(defaultValue.free)
      setAllKsxBalance(bgFree.plus(new BigNumber(defaultValue.reserved)).toNumber())
    }
  }, [defaultValue, isApiReady, pcxFree,currentAccount])


  return (
    <KSXBalanceContext.Provider value={{
      allKsxBalance
    }}
    >
      {children}
    </KSXBalanceContext.Provider>
  );
};
