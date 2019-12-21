// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {View, Text} from 'react-native';

import LabelHelp from './LabelHelp';

type Props = {
  help?: React.ReactNode,
  isHidden?: boolean,
  isOuter?: boolean,
  isSmall?: boolean,
  label?: React.ReactNode,
  labelExtra?: React.ReactNode,
  children: React.ReactNode,
  withEllipsis?: boolean,
  withLabel?: boolean,
};

const defaultLabel: React.ReactNode = <Text>&nbsp;</Text>;

export default function Labelled({
  children,
  help,
  isHidden,
  label = defaultLabel,
  labelExtra,
  style,
  withEllipsis,
  withLabel = true,
}: Props): React.ReactElement<Props> | null {
  if (isHidden) {
    return null;
  } else if (!withLabel) {
    return <Text>{children}</Text>;
  }

  return (
    <View style={[{alignItems: 'center'}, style]}>
      <Text>
        {withEllipsis ? <Text>{label}</Text> : label}
        {help && <LabelHelp help={help} />}
      </Text>
      {labelExtra && <Text>{labelExtra}</Text>}
      <Text numberOfLines={1} ellipsizeMode={'middle'}>
        {children}
      </Text>
    </View>
  );
}
