// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {Text} from 'react-native';
import {formatBalance} from '@polkadot/util';
import {useApi, useCall} from '../../hooks';

export default function TotalIssuance({children, label, style}) {
  const {api} = useApi();
  const totalIssuance = useCall(api.query.balances.totalIssuance, [], {
    transform: totalIssuance => (totalIssuance ? totalIssuance.toString() : ''),
  });

  return (
    <Text style={style}>
      {label || ''}
      {totalIssuance
        ? `${formatBalance(totalIssuance, false)}${
            formatBalance.calcSi(totalIssuance).value
          }`
        : '-'}
      {children}
    </Text>
  );
}
