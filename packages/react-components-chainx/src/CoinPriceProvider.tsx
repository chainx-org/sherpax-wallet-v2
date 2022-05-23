import React, { createContext, FC } from 'react';

import {useCoinPrice} from '@polkadot/react-hooks'


export const CoinPriceContext = createContext<any>({});

export const CoinPriceProvider: FC = ({ children }) => {
  const [coinExchangeRate,btcDollar] = useCoinPrice()

  return (
    <CoinPriceContext.Provider value={{coinExchangeRate,btcDollar}}
    >
      {children}
    </CoinPriceContext.Provider>
  );
};
