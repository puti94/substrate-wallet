// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {useEffect, useState, useCallback, useRef} from 'react';
import {useApi} from './index';
import {CHAINS} from '../config';

export default function useRequest(fn, params = {}) {
  const {systemChain} = useApi();
  const chainName = CHAINS[systemChain] || 'kusama-cc3';
  const [data, setData] = useState({});
  const [error, setError] = useState();
  let newParams = {chainName, ...params};

  const tracker = useRef(null);
  const fetchData = useCallback(() => {
    const serialized = JSON.stringify(newParams);
    if (tracker.current !== serialized) {
      tracker.current = serialized;
      fn(newParams)
        .then(res => setData(res))
        .catch(e => setError(e));
    }
  }, [fn, newParams]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return [
    error,
    data,
    () => {
      tracker.current = null;
      fetchData();
    },
  ];
}
