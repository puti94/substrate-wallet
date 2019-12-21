// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {Text} from 'react-native';
import Icon from './Icon';
import {useApi} from '../hooks';
import {RouteHelper} from 'react-navigation-easy-helper';

export type LinkTypes = 'address' | 'block' | 'extrinsic';

const BASE = 'https://polkascan.io/pre/';

const CHAINS = {
  Alexander: 'alexander',
  Kusama: 'kusama-cc1', // old name via W3F nodes
  'Kusama CC1': 'kusama-cc1',
  'Kusama CC2': 'kusama-cc2',
  'Kusama CC3': 'kusama-cc3',
};

const TYPES: Record<string, string> = {
  address: '/module/account/',
  block: '/system/block/',
  extrinsic: '/system/extrinsic/',
};

function LinkPolkascan({
  data,
  type,
  withShort,
}: Props): React.ReactElement<Props> | null {
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
          url: `${BASE}${extChain}${extType}${data}`,
        });
      }}>
      {withShort ? (
        <Icon icon="external" size={px2dp(30)} />
      ) : (
        i18n('View this {{type}} on Polkascan.io', {type})
      )}
    </Text>
  );
}

export default LinkPolkascan;
