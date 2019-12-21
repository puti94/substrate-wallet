// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {Text} from 'react-native';

import Labelled from './Labelled';

type Props = {
  children?: React.ReactNode,
  defaultValue?: any,
  help?: React.ReactNode,
  isDisabled?: boolean,
  isError?: boolean,
  isHidden?: boolean,
  label?: React.ReactNode,
  value?: React.ReactNode,
  withLabel?: boolean,
};

export default function Static({
  children,
  defaultValue,
  help,
  isHidden,
  label,
  style,
  value,
  withLabel,
}: Props) {
  return (
    <Labelled
      help={help}
      isHidden={isHidden}
      label={label}
      style={style}
      withLabel={withLabel}>
      <Text numberOfLines={1}>
        {value || defaultValue}
        {children}
      </Text>
    </Labelled>
  );
}
