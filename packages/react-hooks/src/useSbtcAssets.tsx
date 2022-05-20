import {useApi} from '@polkadot/react-hooks';
import {useEffect, useState} from 'react';

export interface SbtcAssetsInfo {
    balance: number,
    reserved:number,
}


function useSbtcAssets(account: string, n = 0): SbtcAssetsInfo {
  const {api,isApiReady} = useApi();
  const [state, setState] = useState<SbtcAssetsInfo>({
    balance: 0,
    reserved:0,
  });

  useEffect((): void => {
    let sBtcObj = {
      balance: 0,
      reserved:0,
    }
    //精度 10 8次方
    async function getAssets(account: string): Promise<any> {
      if(isApiReady) {
        if(api.query.assets) {
          const asset = await api.query.assets.account(1, account)
          if(asset.toJSON()) {
            const {balance} = asset.toJSON()
            sBtcObj.balance =  balance  / Math.pow(10,8)
          }

          const assetLock = await api.query.xGatewayRecords.locks(account, 1)
          if(assetLock.toJSON()) {
            sBtcObj.reserved =  assetLock.toJSON() / Math.pow(10,8)
          }

          setState(sBtcObj)
        }
      }
    }

    getAssets(account);

  }, [account]);

  return state;
}

export default useSbtcAssets;
