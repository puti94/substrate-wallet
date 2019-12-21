// Copyright 2017-2019 @polkadot/app-nodeinfo authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {View, Text} from 'react-native';
import {formatNumber} from '@polkadot/util';
import {baseStyles} from '../../../../config/theme';
import CopyText from '../../../../components/CopyText';

const renderPeer = peer => {
  const peerId = peer.peerId.toString();

  return (
    <View style={{flexDirection: 'row'}} key={peerId}>
      <Text>{peer.roles.toString().toLowerCase()}</Text>
      <CopyText style={{flex: 1}}>{peerId}</CopyText>
      <Text>{formatNumber(peer.bestNumber)}</Text>
      <CopyText style={{flex: 1}}>{peer.bestHash.toHex()}</CopyText>
    </View>
  );
};

export default function Peers({peers}) {
  return (
    <View style={[{marginTop: px2dp(30)}]}>
      <Text style={{fontSize: 18}}>connected peers</Text>
      {peers && peers.length ? (
        <View style={baseStyles.cardItem}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{textAlign: 'center'}}>role</Text>
            <Text style={{flex: 1, textAlign: 'center'}}>peer id</Text>
            <Text style={{textAlign: 'center'}}>best #'</Text>
            <Text style={{flex: 1, textAlign: 'center'}}>best hash</Text>
          </View>
          {peers
            .sort((a, b): number => b.bestNumber.cmp(a.bestNumber))
            .map(renderPeer)}
        </View>
      ) : (
        <Text>no peers connected</Text>
      )}
    </View>
  );
}
