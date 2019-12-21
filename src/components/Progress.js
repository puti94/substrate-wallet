/**
 * User: puti.
 * Time: 2019-12-20 20:25.
 */

import {UInt} from '@polkadot/types';
import {View} from 'react-native';
import React, {useState} from 'react';
import {bnToBn, isBn, isUndefined} from '@polkadot/util';
import BN from 'bn.js';

type BaseColors = 'blue' | 'green' | 'red' | 'orange';
export type Colors = 'auto' | 'autoReverse' | BaseColors;
type Props = {
  color?: Colors,
  percent?: BN | number,
  total?: UInt | BN | number,
  value?: UInt | BN | number,
};
export default function Progress({
  color = 'blue',
  percent,
  total,
  style,
  value,
}: Props) {
  let calculated: number | undefined;
  const _total = bnToBn(total);
  const _value = bnToBn(value);

  if (_total.gtn(0)) {
    calculated = (100.0 * _value.toNumber()) / _total.toNumber();
  } else {
    calculated = isBn(percent) ? percent.toNumber() : percent;
  }

  if (isUndefined(calculated) || calculated < 0) {
    return null;
  }

  let rainbow: BaseColors;

  if (color === 'auto' || color === 'autoReverse') {
    if (calculated > 66.6) {
      rainbow = color === 'auto' ? 'green' : 'red';
    } else if (calculated > 33.3) {
      rainbow = 'orange';
    } else {
      rainbow = color === 'auto' ? 'red' : 'green';
    }
  } else {
    rainbow = color;
  }

  return (
    <View
      style={[
        {
          height: px2dp(16),
          width: px2dp(200),
          backgroundColor: '#aaa',
          borderRadius: px2dp(8),
        },
        style,
      ]}>
      <View
        style={{
          flex: 1,
          width: `${calculated}%`,
          backgroundColor: rainbow,
          borderRadius: px2dp(10),
        }}
      />
    </View>
  );
}
