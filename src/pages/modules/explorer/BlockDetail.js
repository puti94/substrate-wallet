// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, {useState, useEffect, useRef} from 'react';
import {View} from 'react-native';
import BaseContainer from '../../../components/BaseContainer';
import {isHex} from '@polkadot/util';
import BlockByHash from '../components/ByHash';
import BlockByNumber from '../components/ByNumber';
import {SearchInput, Button} from 'teaset';

export default function BlockDetail({value}) {
  const [stateValue, setStateValue] = useState(value);
  const [searchValue, setSearchValue] = useState('');
  const beforeValue = useRef(value);
  useEffect(() => {
    if (beforeValue.current !== value) {
      setStateValue(value);
      beforeValue.current = value;
    }
  }, [value]);
  console.log('BlockDetail', stateValue);
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
      {isHex(stateValue) && <BlockByHash value={stateValue} />}
      {!isHex(stateValue) && <BlockByNumber value={stateValue} />}
    </BaseContainer>
  );
}
