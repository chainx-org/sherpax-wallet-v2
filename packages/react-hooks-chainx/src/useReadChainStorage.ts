
import { useEffect, useState } from 'react';
import { useApi } from '@polkadot/react-hooks/useApi';

export default function useAccountAssets(section: string, method: string, params?: any) {
  const [state, setState] = useState<string>('');
  const { api } = useApi();

  useEffect((): void => {
    async function getStorage(section: string, method: string): Promise<void> {
      const { parentHash } = await api.rpc.chain.getHeader();
      const data: string = await api.query[section][method].at(
        parentHash,
        params
      );

      setState(data);
    }

    getStorage(section, method);
  }, [section, method]);

  return state;
}
