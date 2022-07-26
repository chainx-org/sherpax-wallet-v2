// [object Object]
// SPDX-License-Identifier: Apache-2.0

import { useContext, useEffect, useState } from 'react';


import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';

import changeTime from '@polkadot/react-hooks/utils/changeTime';


import { axiosInstance, shortHah } from './useTransfers';

export interface IDataItem {
  // withdrawalId: number;
  assetId: number;
  balance: string;
  extrinsicHash: string;
  blockTimestamp: string;
  shortHashAddrs: string
}

export default function useWithdrawals () {
  const [withdrawals, setWithdrawals] = useState<IDataItem[]>([]);
  const { currentAccount } = useContext(AccountContext);

  useEffect(() => {
    if (!currentAccount) {
      return;
    }

    // sbtc币 提款 精度8
    axiosInstance.get(`/xgateway/${currentAccount}/withdrawals`, {
      params: {
        page: 0,
        page_size: 10
      }
    }).then((res) => {
      if (!res) {
        return;
      }

      const itemMaps = res.data.items.map((item: IDataItem) => {
        item.shortHashAddrs = shortHah(item.extrinsicHash);
        item.blockTimestamp = changeTime(Number(item.blockTimestamp));
        item.balance = String((Number(item.balance) / Math.pow(10, 8)).toFixed(4)) + (item.assetId === 1 ? ' sBTC' : ' DOGE');

        return item;
      });

      setWithdrawals(itemMaps);
    });

    // dog币 提款
  }, [currentAccount]);

  return withdrawals;
}

export function useTransfer () {
  const [transfer, seTransfer] = useState<IDataItem[]>([]);
  const { currentAccount } = useContext(AccountContext);

  useEffect(() => {
    if (!currentAccount) {
      return;
    }

    axiosInstance.get(`/palletAssets/${currentAccount}/transfers`, {
      params: {
        asset_id: 1,
        page: 0,
        page_size: 5
      }
    }).then((res) => {

      axiosInstance.get(`/palletAssets/${currentAccount}/transfers`, {
        params: {
          asset_id: 9,
          page: 0,
          page_size: 5
        }
      }).then(res2 => {
        res.data.items.push(...res2.data.items)
        const itemMaps = res.data.items.map((item: IDataItem) => {
          item.shortHashAddrs = shortHah(item.extrinsicHash);
          item.blockTimestamp = changeTime(Number(item.blockTimestamp));
          item.balance = String((Number(item.balance) / Math.pow(10, 8)).toFixed(4)) + (item.assetId === 1 ? ' sBTC' : ' DOGE');

          return item;
        });

        seTransfer(itemMaps);
      })

    });
  }, [currentAccount]);

  return transfer;
}
