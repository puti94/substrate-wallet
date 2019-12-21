// Copyright 2017-2019 @polkadot/app-nodeinfo authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {formatNumber} from '@polkadot/util';
import CardSummary from '../../../../components/CardSummary';
import Elapsed from '../../../../components/query/Elapsed';
import BestNumber from '../../../../components/BestNumber';

const ZERO = new BN(0);
const EMPTY_INFO = {extrinsics: null, health: null, peers: null};

export default function Summary({
  info: {extrinsics, health, peers} = EMPTY_INFO,
  nextRefresh,
}) {
  const [peerBest, setPeerBest] = useState(ZERO);

  useEffect(() => {
    if (!peers) {
      return;
    }

    const bestPeer = peers.sort(
      (a, b): number => b.bestNumber.cmp(a.bestNumber),
    )[0];

    setPeerBest(bestPeer ? bestPeer.bestNumber : new BN(0));
  }, [peers]);

  return (
    <View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <CardSummary label={'refresh in'}>
          <Elapsed value={nextRefresh} />
        </CardSummary>
        <CardSummary label={'total peers'}>
          {health ? `${health.peers.toNumber()}` : '-'}
        </CardSummary>
        <CardSummary className="ui--media-small" label={'syncing'}>
          {health ? (health.isSyncing.valueOf() ? 'yes' : 'no') : '-'}
        </CardSummary>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: px2dp(40),
        }}>
        <CardSummary label={'queued tx'}>
          {extrinsics ? `${extrinsics.length}` : '-'}
        </CardSummary>
        <CardSummary label={'peer best'}>{formatNumber(peerBest)}</CardSummary>
        <CardSummary label={'our best'}>
          <BestNumber />
        </CardSummary>
      </View>
    </View>
  );
}
