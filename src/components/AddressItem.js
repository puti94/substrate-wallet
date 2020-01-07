/**
 * User: puti.
 * Time: 2019-12-11 15:03.
 */
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Identicon from '@polkadot/reactnative-identicon';
import AddressText from './AddressText';
import {theme} from '../config/theme';
import AccountName from './AccountName';
import AccountIndex from './AccountIndex';

export default function AddressItem({
  address,
  onPress,
  isSelected,
  defaultName,
  children,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        {
          backgroundColor: isSelected ? theme.baseColor : 'white',
        },
      ]}>
      <View style={styles.items}>
        <Identicon value={address} size={px2dp(40)} />
        <View style={{flex: 1, marginLeft: px2dp(20)}}>
          <AccountName
            style={{color: isSelected ? 'white' : 'black', fontSize: 16}}
            defaultName={defaultName}
            params={address}
          />
          <AccountIndex
            style={{color: isSelected ? 'white' : 'black', fontSize: 14}}
            params={address}
          />
          <AddressText
            style={{color: isSelected ? 'white' : 'black', fontSize: 12}}
            needCopy={false}
            address={address}
          />
        </View>
      </View>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  items: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: px2dp(20),
    height: px2dp(140),
    borderWidth: theme.hairline,
    borderColor: theme.borderColor,
  },
});
