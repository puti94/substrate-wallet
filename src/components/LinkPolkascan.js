// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {Text} from 'react-native';
import Icon from './Icon';
import {useApi} from '../hooks';
import {RouteHelper} from 'react-navigation-easy-helper';
import {CHAINS, EXPLORER_BASE} from '../config';

export type LinkTypes = 'address' | 'block' | 'extrinsic';

const TYPES: Record<string, string> = {
  address: '/module/account/',
  block: '/system/block/',
  extrinsic: '/system/extrinsic/',
};

function LinkPolkascan({data, type, withShort}) {
  const {systemChain} = useApi();
  const extChain = CHAINS[systemChain];
  const extType = TYPES[type];

  if (!extChain || !extType) {
    return null;
  }

  return (
    <Text
      onPress={() => {
        RouteHelper.navigate('Web', {
          url: `${EXPLORER_BASE}${extChain}${extType}${data}`,
        });
      }}>
      {withShort ? (
        <Icon icon="external" size={px2dp(30)} />
      ) : (
        `View this ${type} on Polkascan.io`
      )}
    </Text>
  );
}

export default LinkPolkascan;
