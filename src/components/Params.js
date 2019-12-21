// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {Text, View} from 'react-native';

import AddressText from './AddressText';
import {formatBalance} from '../utils/format';
import {baseStyles, theme} from '../config/theme';

function Param({type, value, style}) {
  let valueEl;
  switch (type) {
    case 'Balance':
    case 'BalanceOf':
    case 'Amount':
    case 'AssetOf':
      valueEl = formatBalance(value);
      break;
    case 'AccountId':
    case 'AuthorityId':
    case 'AccountIdOf':
    case 'Address':
    case 'SessionKey':
    case 'ValidatorId':
      valueEl = <AddressText address={value} />;
      break;
    default:
      valueEl = `${value}`;
  }
  return (
    <View style={[baseStyles.paramsItem, style]}>
      <Text style={{color: theme.content}}>{type}</Text>
      <Text style={{fontSize: 12}} numberOfLines={1} ellipsizeMode={'middle'}>
        {valueEl}
      </Text>
    </View>
  );
}

export default function Params({params, values, style}) {
  return (
    <View style={style}>
      {params.map((t, i) => (
        <Param key={i} type={t} value={values[i]} />
      ))}
    </View>
  );
}
