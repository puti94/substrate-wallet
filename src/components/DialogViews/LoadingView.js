/**
 * User: puti.
 * Time: 2018/12/6 1:47 PM.
 */

import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import {Overlay} from 'teaset';

const {width, height} = Dimensions.get('window');

export function LoadingView({message, modal}) {
  return (
    <Overlay.PopView
      animated={false}
      containerStyle={{
        width: width,
        height: height,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      overlayOpacity={0}
      modal={modal}>
      <View style={styles.container}>
        <ActivityIndicator size={'large'} />
        {!!message && <Text style={styles.text}>{message}</Text>}
      </View>
    </Overlay.PopView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: px2dp(200),
    minHeight: px2dp(200),
    backgroundColor: '#000000A0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: px2dp(8),
    paddingHorizontal: px2dp(20),
  },
  text: {
    color: 'white',
    fontSize: 14,
    marginTop: px2dp(20),
    textAlign: 'center',
  },
});
