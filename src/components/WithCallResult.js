/**
 * User: puti.
 * Time: 2019-12-02 19:16.
 */

import {Text, View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {useApi, useCall, useFormatValue} from '../hooks';

export default function WithCallResult({
  module,
  call,
  arg = [],
  section = 'rpc',
}) {
  const [isOpen, setOpen] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{flex: 1}}>
          {module}.{call}
        </Text>
        <Text onPress={() => setOpen(!isOpen)}>{isOpen ? '关闭' : '展开'}</Text>
      </View>
      <Result
        module={module}
        call={call}
        arg={arg}
        isOpen={isOpen}
        section={section}
      />
    </View>
  );
}

function Result({module, call, arg = [], section = 'rpc', isOpen}) {
  const {api} = useApi();
  const result = useCall(api[section][module][call], arg, {isSingle: false});
  const _result = useFormatValue(result, result && result.toRawType());
  return <>{!!(!!result && isOpen) && <Text selectable>{_result}</Text>}</>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: px2dp(650),
    alignSelf: 'center',
    padding: px2dp(10),
    marginTop: px2dp(10),
    borderRadius: px2dp(5),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: px2dp(60),
  },
});
