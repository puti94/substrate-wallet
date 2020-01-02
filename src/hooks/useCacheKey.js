// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {useApi} from './index';

// create a chain-specific key for the local cache
export default function useCacheKey(storageKeyBase) {
  const {api, isDevelopment} = useApi();
  const STORAGE_KEY = `${storageKeyBase}:${
    isDevelopment ? 'development' : api.genesisHash
  }`;

  return [
    () => {
      const str = localStorage.getItem(STORAGE_KEY);
      try {
        return JSON.parse(str);
      } catch (e) {
        return str;
      }
    },
    value => {
      if (typeof value !== 'string') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } else {
        localStorage.setItem(STORAGE_KEY, value);
      }
    },
  ];
}
