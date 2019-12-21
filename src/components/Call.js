// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {GenericCall, getTypeDef} from '@polkadot/types';
import Static from './Static';
import Params from './Params';
import {formatBalance} from '../utils/format';
import {baseStyles, theme} from '../config/theme';

// import Static from './Static';

export type Props = {
  children?: React.ReactNode,
  labelHash?: React.ReactNode,
  mortality?: string,
  onError?: () => void,
  value: any,
  withHash?: boolean,
  tip?: BN,
};

export default function Call({
  children,
  labelHash,
  mortality,
  onError,
  style,
  tip,
  value,
  withHash,
}) {
  const params = GenericCall.filterOrigin(value.meta).map(
    ({name, type}) => getTypeDef(type.toString()).type,
  );
  const values = value.args;
  const hash = withHash ? value.hash : null;
  return (
    <View style={style}>
      <Params
        style={{marginLeft: px2dp(60)}}
        isDisabled
        onError={onError}
        params={params}
        values={values}
      />
      {children}
      <View>
        {hash && (
          <Static
            style={[baseStyles.paramsItem, styles.items]}
            label={labelHash || 'extrinsic hash'}>
            {hash.toHex()}
          </Static>
        )}
        {mortality && (
          <Static
            style={[baseStyles.paramsItem, styles.items]}
            label={'lifetime'}>
            {mortality}
          </Static>
        )}
        {tip && tip.gtn(0) && (
          <Static label={'tip'}>
            <Text>{formatBalance(tip, false)}</Text>
          </Static>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  items: {
    alignItems: 'flex-start',
  },
});
