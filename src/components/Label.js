// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {View, Text} from 'react-native';

import LabelHelp from './LabelHelp';

type Props = {
  help?: React.ReactNode,
  label?: React.ReactNode,
  withEllipsis?: boolean,
};

export default function Label({help, label}: Props): React.ReactElement<Props> {
  return (
    <View>
      <Text>{label}</Text>
      {help && <LabelHelp help={help} />}
    </View>
  );
}
