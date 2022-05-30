import { useContext, useEffect, useState } from 'react';
import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import { useApi } from './useApi';


function hex2str(hex:string) {
  let trimedStr = hex.trim();
  let rawStr = trimedStr.substring(0,2).toLowerCase() === "0x" ? trimedStr.substring(2) : trimedStr;
  let len = rawStr.length;
  if(len % 2 !== 0) {
    alert("Illegal Format ASCII Code!");
    return "";
  }
  let curCharCode;
  let resultStr = [];
  for(let i = 0; i < len;i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16);
    resultStr.push(String.fromCharCode(curCharCode));
  }
  return resultStr.join("");
}


export function useLocked(address:string,n = 0) {
  const { api, isApiReady } = useApi();
  const { currentAccount } = useContext(AccountContext);

  const [locked, setLocked] = useState([]);

  useEffect((): void => {

    fetchVestedFree()

  }, [currentAccount, isApiReady]);

  async function fetchVestedFree() {
    if (!address) {
      return;
    } else
    if (isApiReady) {
      const balancelocks = await api.query.balances.locks(address)
      const balanceJson:any = balancelocks.toJSON()

      const targetBalanceLocks = balanceJson.map((item:any) => {
        let copyItem = JSON.parse(JSON.stringify(item))
        copyItem.id = hex2str(copyItem.id)
        // copyItem.amount = Number(copyItem.amount / Math.pow(10,18))
        return copyItem
      })
      setLocked(targetBalanceLocks)
    }
  }

  return locked
}
