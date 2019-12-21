// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';

import Elapsed from './Elapsed';
import {useApi, useCall} from '../../hooks';

export default function TimeNow({children, label, style}) {
  const {api, isSubstrateV2} = useApi();
  const timestamp = useCall(api.query.timestamp.now, []);
  const [now, setNow] = useState();

  useEffect((): void => {
    setNow(isSubstrateV2 || !timestamp ? timestamp : timestamp.muln(1000));
  }, [timestamp, isSubstrateV2]);

  return (
    <Text style={style}>
      {label || ''}
      <Elapsed value={now} />
      {children}
    </Text>
  );
}
