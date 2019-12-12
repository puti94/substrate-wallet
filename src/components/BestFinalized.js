// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {Text} from 'react-native';
import {formatNumber} from '@polkadot/util';
import {useApi, useCall} from '../hooks';

type Props = {
  label?: string,
};

export default function BestFinalized({
  children,
  label,
  style,
}: Props): React.ReactElement<Props> {
  const {api} = useApi();
  const bestNumberFinalized = useCall(api.derive.chain.bestNumberFinalized);
  return (
    <Text style={style}>
      {label || ''}
      {bestNumberFinalized ? formatNumber(bestNumberFinalized) : '-'}
      {children}
    </Text>
  );
}
