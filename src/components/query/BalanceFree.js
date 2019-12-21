/**
 * @flow
 * User: puti.
 * Time: 2019-12-11 20:41.
 */

import React from 'react';
import {Text} from 'react-native';
import {useApi, useCall} from '../../hooks';
import {formatBalance} from '../../utils/format';

export default function BalanceFree({params, label, ...otherParams}) {
  const {api, isApiReady} = useApi();
  const balancesValue = useCall(
    isApiReady ? api.query.balances.freeBalance : null,
    [params],
  );
  return (
    <Text {...otherParams}>
      {label}
      {formatBalance(balancesValue)}
    </Text>
  );
}
