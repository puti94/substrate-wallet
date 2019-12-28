// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {Text} from 'react-native';
import {useApi, useCall} from '../../hooks';
import {formatBalance} from '../../utils/format';

type Props = {
  children?: React.ReactNode,
  label?: React.ReactNode,
  params: string,
  label?: string,
};

export default function Available({params, label, onChange, ...others}: Props) {
  const {api} = useApi();
  const allBalances = useCall(api.derive.balances.all, [params]);
  console.log('Available', formatBalance(allBalances?.availableBalance));
  onChange && onChange(allBalances?.availableBalance);
  return (
    <Text {...others}>
      {label}
      {formatBalance(allBalances?.availableBalance)}
    </Text>
  );
}
