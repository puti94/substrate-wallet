// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, {useState, useEffect, useRef} from 'react';
import {Text, View} from 'react-native';
import BaseContainer from '../../../components/BaseContainer';
import {isHex} from '@polkadot/util';
import {useApi, useCall} from '../../../hooks';
import BlockByHash from '../components/ByHash';
import BlockByNumber from '../components/ByNumber';
import {SearchInput, Button} from 'teaset';

export default function BlockDetail({value}) {
  const {api, isApiReady} = useApi();
  const bestNumber = useCall(
    isApiReady ? api.derive.chain.bestNumber : null,
    [],
    {isSingle: true},
  );
  const [stateValue, setStateValue] = useState(value || bestNumber);
  const [searchValue, setSearchValue] = useState('');
  const beforeValue = useRef(value);
  useEffect(() => {
    if (!value) {
      setStateValue(bestNumber);
    }
    if (beforeValue.current !== value) {
      setStateValue(value);
      beforeValue.current = value;
    }
  }, [bestNumber, value]);
  console.log('BlockDetail', bestNumber, stateValue);
  return (
    <BaseContainer useScrollView title={'Block details'}>
      <View style={{flexDirection: 'row', padding: px2dp(30)}}>
        <SearchInput
          value={searchValue}
          onChangeText={setSearchValue}
          style={{flex: 1}}
          placeholder={'clock hash or number to query'}
        />
        <Button
          title={'Search'}
          type={'link'}
          onPress={() => {
            setStateValue(searchValue);
          }}
        />
      </View>
      {isHex(stateValue) ? (
        <BlockByHash value={stateValue} />
      ) : (
        <BlockByNumber value={stateValue} />
      )}
    </BaseContainer>
  );
}
