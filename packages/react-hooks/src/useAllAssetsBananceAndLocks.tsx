import {useApi} from '@polkadot/react-hooks';
import {useEffect, useState} from 'react';

export interface IAssetsInfo {
    balance: number,
    reserved:number,
}


export function useAllAssetsBananceAndLocks(account: string,assetsID:number, n = 0): IAssetsInfo {
  const {api,isApiReady} = useApi();
  const [state, setState] = useState<IAssetsInfo>({
    balance: 0,
    reserved:0,
  });

  useEffect((): void => {
    let coinObj = {
      balance: 0,
      reserved:0,
    }
    //精度 10 8次方
    async function getAssets(account: string): Promise<any> {
      if(isApiReady) {
        if(api.query.assets) {
          const asset = await api.query.assets.account(assetsID, account)
          if(asset.toJSON()) {
            const {balance} = asset.toJSON()
            coinObj.balance =  balance  / Math.pow(10,8)
          }

          const assetLock = await api.query.xGatewayRecords.locks(account, assetsID)
          if(assetLock.toJSON()) {
            coinObj.reserved =  assetLock.toJSON() / Math.pow(10,8)
          }

          setState(coinObj)
        }
      }
    }

    getAssets(account);

  }, [account,assetsID,n]);

  return state;
}


