import React, { createContext, FC } from 'react';

import {useTokenList} from '@polkadot/react-hooks'
import {ITokens} from "@polkadot/react-hooks/src/useTokenList";


export const TokenListContext = createContext<ITokens[]>([]);

export const TokenListProvider: FC = ({ children }) => {
  const tokenList = useTokenList()

  return (
    <TokenListContext.Provider value={tokenList}
    >
      {children}
    </TokenListContext.Provider>
  );
};
