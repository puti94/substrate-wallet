// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {View, Text} from 'react-native';

import {useApi, useCall} from '../../../hooks';
import {BlockHeader} from '../explorer/BlockHeaders';
import {theme} from '../../../config/theme';
import Extrinsics from './Extrinsics';
import Events from '../explorer/Events';
import Logs from '../explorer/Logs';

export default function BlockByHash({value}) {
  const {api} = useApi();
  const events = useCall(api.query.system.events.at, [value]);
  const getBlock = useCall(api.rpc.chain.getBlock, [value]);
  const getHeader = useCall(api.rpc.chain.getHeader, [value]);
  console.log('events', getBlock, getHeader, events, value);
  if (!getBlock || getBlock.isEmpty || !getHeader) {
    return null;
  }
  return (
    <View style={{paddingHorizontal: px2dp(40)}}>
      <View>
        <BlockHeader
          style={{backgroundColor: theme.backgroundColor, paddingLeft: 0}}
          value={getHeader}
          withExplorer
        />
      </View>
      <Text style={{fontSize: 18}}>extrinsics</Text>
      <Extrinsics value={getBlock.block.extrinsics} />
      <Text style={{fontSize: 18}}>events</Text>
      <Events
        events={(events || []).map((record, index) => ({
          key: `${index}`,
          record,
        }))}
      />
      <Text style={{fontSize: 18}}>logs</Text>
      <Logs value={getHeader.digest.logs} />
    </View>
  );
}
