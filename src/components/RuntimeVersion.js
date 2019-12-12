
// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {Text} from 'react-native';
import {useApi, useCall} from '../hooks';

type Props = {
  children?: React.ReactNode,
  label?: string,
};

export default function RuntimeVersion({children, style, label}: Props) {
  const {api} = useApi();
  const runtimeVersion = useCall(api.rpc.state.subscribeRuntimeVersion);
  return (
    <Text style={style}>
      {label || 'version '}
      {runtimeVersion ? runtimeVersion.specVersion.toNumber() : '-'}
      {children}
    </Text>
  );
}
