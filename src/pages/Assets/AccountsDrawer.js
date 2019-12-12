/**
 * User: puti.
 * Time: 2019-12-11 15:03.
 */
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import Identicon from '@polkadot/reactnative-identicon';
import keyring from '@polkadot/ui-keyring';
import BaseContainer from '../../components/BaseContainer';
import AddressText from '../../components/AddressText';
import {useAccounts} from '../../hooks';
import {theme} from '../../config/theme';
import CommonButton from '../../components/CommonButton';

export default function AccountsDrawer() {
  const allAccounts = useAccounts();
  return (
    <BaseContainer
      fitIPhoneX
      style={{width: px2dp(500), backgroundColor: 'white'}}
      title={'选择账号'}
      hideLeft
      navStyle={{backgroundColor: 'white'}}
      titleStyle={{color: 'black'}}>
      <ScrollView style={{flex: 1}}>
        {allAccounts.map(t => (
          <AccountItem key={t} address={t} />
        ))}
      </ScrollView>
      <View style={{minHeight: px2dp(400), marginTop: px2dp(20)}}>
        <CommonButton
          onPress={() => {}}
          title={'创建钱包'}
          icon={'addfolder'}
        />
      </View>
    </BaseContainer>
  );
}

function AccountItem({address}) {
  const {meta = {}} = keyring.getPair(address);
  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.items}>
      <Identicon value={address} size={px2dp(40)} />
      <View style={{flex: 1, marginLeft: px2dp(20)}}>
        <Text style={{color: 'black', fontSize: 16}}>{meta.name}</Text>
        <AddressText needCopy={false} address={address} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  items: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: px2dp(20),
    height: px2dp(100),
    backgroundColor: 'white',
    borderWidth: theme.hairline,
    borderColor: theme.borderColor,
  },
});
