// Copyright 2017-2019 @polkadot/app-nodeinfo authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, {useEffect, useState} from 'react';

import Peers from './Peers';
import Summary from './Summary';
import {useApi} from '../../../../hooks';
import Extrinsics from '../../components/Extrinsics';
import BaseContainer from '../../../../components/BaseContainer';
import {Text, View} from 'react-native';

const POLL_TIMEOUT = 9900;

async function retrieveInfo(api) {
  try {
    const [blockNumber, health, peers, extrinsics] = await Promise.all([
      api.derive.chain.bestNumber(),
      api.rpc.system.health(),
      api.rpc.system.peers(),
      api.rpc.author.pendingExtrinsics(),
    ]);

    return {blockNumber, extrinsics, health, peers};
  } catch (error) {
    return {};
  }
}

export default function NodeInfo() {
  const {api} = useApi();
  const [info, setInfo] = useState({});
  const [nextRefresh, setNextRefresh] = useState(Date.now());

  useEffect(() => {
    const _getStatus = () => {
      retrieveInfo(api).then(setInfo);
    };

    _getStatus();

    const timerId = window.setInterval(() => {
      setNextRefresh(Date.now() + POLL_TIMEOUT);
      _getStatus();
    }, POLL_TIMEOUT);

    return (): void => {
      clearInterval(timerId);
    };
  }, [api]);

  return (
    <BaseContainer
      navBar={null}
      useScrollView
      contentContainerStyle={{padding: px2dp(40)}}>
      <Summary info={info} nextRefresh={nextRefresh} />
      <Peers peers={info.peers} />
      <Text style={{fontSize: 18, marginTop: px2dp(40)}}>
        pending extrinsics
      </Text>
      <Extrinsics
        blockNumber={info.blockNumber}
        label={'pending extrinsics'}
        value={info.extrinsics}
      />
    </BaseContainer>
  );
}
