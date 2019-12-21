// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';
import {Text} from 'react-native';
import {formatBalance} from '../utils/format';

type Props = {
  children?: React.ReactNode,
  label?: React.ReactNode,
  value?: BN | string | null,
};

export default function FormatBalance({
  children,
  label,
  value,
  ...others
}: Props) {
  return (
    <Text {...others}>
      {label || ''}
      {formatBalance(value)}
      {children}
    </Text>
  );
}
