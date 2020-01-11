// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {Text, View} from 'react-native';

import {baseStyles, theme} from '../config/theme';
import {useFormatValue} from '../hooks';

function Param({type, value, style}) {
  const valueEl = useFormatValue(value, type);
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
