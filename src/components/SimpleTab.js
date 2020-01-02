/**
 * User: puti.
 * Time: 2019-12-17 19:40.
 */
import React from 'react';
import {View, Text} from 'react-native';

import {theme} from '../config/theme';

export default function SimpleTab({tabs = [], setTabIndex, index}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: px2dp(30),
        height: px2dp(80),
        alignItems: 'center',
      }}>
      {tabs.map((t, i) => (
        <>
          <Text
            onPress={() => setTabIndex(i)}
            style={{
              fontSize: 18,
              color: index === i ? theme.title : theme.baseColor,
            }}>
            {t}
          </Text>
          {i < tabs.length - 1 && <Text style={{fontSize: 18}}> / </Text>}
        </>
      ))}
    </View>
  );
}
