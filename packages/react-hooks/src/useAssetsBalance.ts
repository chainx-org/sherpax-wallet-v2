// [object Object]
// SPDX-License-Identifier: Apache-2.0

import axios, { AxiosInstance } from 'axios';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { AccountContext } from '@polkadot/react-components-chainx/AccountProvider';
import { CoinPriceContext } from '@polkadot/react-components-chainx/CoinPriceProvider';
import { KSXBalanceContext } from '@polkadot/react-components-chainx/KSXBalanceProvider';
import { TokenListContext } from '@polkadot/react-components-chainx/TokenListProvider';
import { useApi } from '@polkadot/react-hooks';

interface ITokens {
  chainId: number;
  address: string;
  assetId: number;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}
export interface ICurrentBalance {
  transBalance: number
  coin: string,
  logo: string,
  decimals: number;
  assetId: number;
}
export interface ICoinData {
  coin: string,
  price: number
}

export interface ITotalBalance {
  coin: string,
  dollar: number,
  percent: number,
  logo: string,
  coinNum: number,
  decimals: number;
  assetId: number;
  address?: string
}

export interface IEstimated {
  estimatedDollar: string,
  estimatedBtc: string
}

export let coinInstance: AxiosInstance;
let tokenListInstance: AxiosInstance;
let testInstance: AxiosInstance;

tokenListInstance = axios.create({ baseURL: 'https://raw.githubusercontent.com/chainx-org/token-list/main/' });

if (process.env.NODE_ENV === 'development') {
  coinInstance = axios.create({ baseURL: '/v1' });
  // testInstance = axios.create({baseURL:'http://localhost:3004'})
} else if (process.env.NODE_ENV === 'production') {
  coinInstance = axios.create({ baseURL: '' });
}

export default function useAssetsBalance () {
  const { currentAccount } = useContext(AccountContext);
  const [currentBalance, setCurrentBalance] = useState<ICurrentBalance[]>([]);
  // const [tokenList,setTokenList] = useState<ITokens[]>([])
  const [totalBalance, setTotalBalance] = useState<ITotalBalance[]>([]);
  const [estimated, setEstimated] = useState<IEstimated>({ estimatedDollar: '', estimatedBtc: '' });
  const { api } = useApi();
  const targetArr: ICurrentBalance[] = [];
  // 获取ksx
  const { allKsxBalance } = useContext(KSXBalanceContext);
  // 获取tokenList
  const tokenList = useContext(TokenListContext);
  // 获取coin 价格
  const { btcDollar, coinExchangeRate } = useContext(CoinPriceContext);

  useEffect(() => {
    setCurrentBalance([]);

    tokenList.map(async (item) => {
      const { assetId } = item;

      // 增加ksx 计算总资产
      if (assetId === 99) {
        targetArr.push({ transBalance: allKsxBalance / Math.pow(10, 18),
          coin: item.symbol.toUpperCase(),
          logo: item.logoURI,
          assetId: item.assetId,
          decimals: item.decimals,
          address: item.address });

        return;
      }

      const res = await api.query.assets.account([assetId], currentAccount);

      if (!res?.toJSON()) {
        // 增加跨链资产中余额为0的币
        targetArr.push({ transBalance: 0, coin: item.symbol.toUpperCase(), logo: item.logoURI, assetId: item.assetId, decimals: item.decimals, address: item.address });

        if (targetArr.length === tokenList.length) {
          setCurrentBalance(targetArr);
        }

        return;
      }

      const { balance } = res?.toJSON();
      const transBalance = balance / Math.pow(10, item.decimals);

      targetArr.push({ transBalance, coin: item.symbol.toUpperCase(), logo: item.logoURI, assetId: item.assetId, decimals: item.decimals, address: item.address });

      if (targetArr.length === tokenList.length) {
        setCurrentBalance(targetArr);
      }
    });
  }, [currentAccount, tokenList, allKsxBalance]);

  // 转为需要的数据
  // 1.所有币种对应的美元
  // 2.总美元 以及总美元 -> btc
  useEffect(() => {
    const totalBalanceOrigin = coinExchangeRate.map((item: any) => {
      let coin = item.coin.toUpperCase();
      const [balance] = currentBalance.filter((balance) => {
        if (coin === 'WKSX') {
          coin = 'KSX';
        }

        if (coin === 'BTC') {
          coin = 'XBTC';
        }

        return balance.coin.toUpperCase() === coin;
      });

      if (!balance) {
        return;
      }

      return {
        coin: `${balance.coin}`,
        address: balance.address,
        dollar: Number((balance.transBalance * item.price).toFixed(6)),
        percent: ((balance.transBalance * item.price) / Number(estimated.estimatedDollar)) ? ((balance.transBalance * item.price) / Number(estimated.estimatedDollar)) : 0,
        logo: balance.logo,
        coinNum: balance.transBalance,
        decimals: balance.decimals,
        assetId: balance.assetId,
        price: item.price
      };
    });

    const totalBalance = totalBalanceOrigin.sort((a: any, b: any) => b.percent - a.percent).filter(Boolean);

    setTotalBalance(totalBalance);

    const estimatedDollar = totalBalance.reduce((prev: any, current: any) => {
      return prev + current.dollar;
    }, 0);

    let estimatedBtc = (estimatedDollar / btcDollar).toFixed(3);

    if (estimatedBtc == 'NaN') {
      estimatedBtc = '0.000';
    }

    setEstimated({ estimatedDollar: Number(estimatedDollar.toFixed(3)).toLocaleString(), estimatedBtc });
  }, [currentBalance, coinExchangeRate, estimated.estimatedDollar]);

  return [totalBalance, estimated];
}
