// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {Text} from 'react-native';
import {formatNumber} from '@polkadot/util';
import {useApi, useCall} from '../../hooks';

export default function TimePeriod({children, className, label, style}) {
  const {api, isApiReady} = useApi();
  const minimumPeriod = useCall(
    isApiReady ? api.query.timestamp.minimumPeriod : null,
    [],
  );

  return (
    <Text className={className} style={style}>
      {label || ''}
      {isApiReady
        ? `${formatNumber(
            api.consts.babe.expectedBlockTime.toNumber() / 1000,
          )}s`
        : minimumPeriod
        ? `${formatNumber(
            minimumPeriod.gtn(1000)
              ? minimumPeriod.toNumber() / 500
              : minimumPeriod.toNumber() * 2,
          )}s`
        : '-'}
      {children}
    </Text>
  );
}
