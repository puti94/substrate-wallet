// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {AccountId, Address} from '@polkadot/types/interfaces';

import React from 'react';
import {Text} from 'react-native';
import {useApi, useCall} from '../hooks';

type Props = {
  children?: React.ReactNode,
  defaultValue?: string,
  label?: React.ReactNode,
  params?: string | AccountId | Address | null,
};

export default function AccountIndex({
  children,
  defaultValue,
  label,
  params,
  style,
}: Props): React.ReactElement<Props> {
  const {api} = useApi();
  const {accountIndex} = useCall(api.derive.accounts.info, [params]) || {};

  return (
    <Text style={style}>
      {label || ''}
      {`${accountIndex || defaultValue || '-'}`}
      {children}
    </Text>
  );
}
