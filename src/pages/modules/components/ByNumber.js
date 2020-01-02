// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import BlockByHash from './ByHash';
import {useApi, useCall} from '../../../hooks';

export default function BlockByNumber({value}) {
  const {api} = useApi();
  const getBlockHash = useCall(api.rpc.chain.getBlockHash, [value], {
    isSingle: true,
  });
  console.log('getBlockHash', value, getBlockHash);
  if (!getBlockHash) {
    return null;
  }
  return <BlockByHash value={getBlockHash.toHex()} />;
}
