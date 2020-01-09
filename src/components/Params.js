// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {Text, View} from 'react-native';

import AddressText from './AddressText';
import {formatBalance} from '../utils/format';
import {baseStyles, theme} from '../config/theme';
import {mapInputType} from '../utils/convert';
import {useApi} from '../hooks';
import {
  TYPE_ADDRESS,
  TYPE_ADDRESS_WITHACCOUNT,
  TYPE_ADDRESS_WITHBOOK,
  TYPE_BALANCE,
  TYPE_BOOL,
} from './Forms';

function Param({type, value, style}) {
  const {api} = useApi();
  const _type = mapInputType(api, type);
  let valueEl;
  switch (_type) {
    case TYPE_BALANCE:
      valueEl = formatBalance(value, false);
      break;
    case TYPE_ADDRESS:
    case TYPE_ADDRESS_WITHACCOUNT:
    case TYPE_ADDRESS_WITHBOOK:
      valueEl = <AddressText address={value} />;
      break;
    case TYPE_BOOL:
      valueEl = value ? 'Yes' : 'No';
      break;
    default:
      valueEl = `${value}`;
  }
  return (
    <View style={[baseStyles.paramsItem, style]}>
      <Text style={{color: theme.content}}>{`${type}`}</Text>
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
