// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {useApi} from './index';
import {mapInputType} from '../utils/convert';
import {
  TYPE_ADDRESS,
  TYPE_ADDRESS_WITHACCOUNT,
  TYPE_ADDRESS_WITHBOOK,
  TYPE_BALANCE,
  TYPE_BOOL,
} from '../components/Forms';
import {formatBalance} from '../utils/format';
import AddressText from '../components/AddressText';

export default function useFormatValue(value, type) {
  const {api} = useApi();
  if (!value || !type) {
    return '';
  }
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
  return valueEl;
}
