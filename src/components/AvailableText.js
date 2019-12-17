// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {Text} from 'react-native';
import {formatBalance} from '../utils/format';
import {useApi, useCall} from '../hooks';

export default function AvailableText({address, onChange, ...otherParams}) {
  const {api} = useApi();
  const allBalances = useCall(api.derive.balances.all, [address]);
  onChange && allBalances && onChange(allBalances.availableBalance);
  return (
    <Text {...otherParams}>
      {formatBalance(allBalances ? allBalances.availableBalance : 0)}
    </Text>
  );
}
