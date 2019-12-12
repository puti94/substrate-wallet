// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {AccountId, AccountIndex, Address} from '@polkadot/types/interfaces';

import React from 'react';
import {Text} from 'react-native';
import {useApi, useCall} from '../hooks';
import getAddressMeta from '../utils/getAddressMeta';

type Props = {
  children?: React.ReactNode,
  defaultName?: string,
  label?: React.ReactNode,
  onClick?: () => void,
  override?: React.ReactNode,
  params?: AccountId | AccountIndex | Address | string | null,
  toggle?: any,
  withShort?: boolean,
};

const nameCache: Map<string, string> = new Map();

function defaultOrAddr(defaultName = '', _address): string {
  const accountId = (_address || '').toString();
  const cached = nameCache.get(accountId);

  if (cached) {
    return cached;
  }

  let meta = getAddressMeta(_address);
  return meta.name
    ? meta.name.toUpperCase()
    : defaultName
    ? defaultName.toUpperCase()
    : '-';
}

export default function AccountName({
  children,
  defaultName,
  label,
  onClick,
  override,
  params,
  style,
  withShort,
}: Props): React.ReactElement<Props> {
  const {api} = useApi();
  const {accountIndex, nickname} =
    useCall(api.derive.accounts.info, [params]) || {};
  let name;
  if (!nickname) {
    name = defaultOrAddr(defaultName, params, withShort ? null : accountIndex);
  } else {
    name = nickname.toUpperCase();
  }
  return (
    <Text
      onPress={override ? undefined : onClick}
      style={style}
      numberOfLines={1}>
      {label || ''}
      {override || name}
      {children}
    </Text>
  );
}
