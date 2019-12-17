/**
 * @flow
 * User: puti.
 * Time: 2019-12-11 20:41.
 */

import React from 'react';
import {Text} from 'react-native';
import {useApi, useCall} from '../hooks';
import {formatBalance} from '../utils/format';

export default function BalanceText({address, onChange, ...otherParams}) {
  const {api, isApiReady} = useApi();
  const balancesValue = useCall(
    isApiReady ? api.query.balances.freeBalance : null,
    [address],
  );
  onChange && onChange(balancesValue);
  return <Text {...otherParams}>{formatBalance(balancesValue)}</Text>;
}
