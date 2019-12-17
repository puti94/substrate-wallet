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
import {EmptyView} from '../../components/EmptyView';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {toHex} from '../../utils/defaults';
import AccountName from '../../components/AccountName';
import AccountIndex from '../../components/AccountIndex';
import {RouteHelper} from 'react-navigation-easy-helper';

export default function AccountsDrawer({onClose}) {
  const allAccounts = useAccounts();
  return (
    <BaseContainer
      fitIPhoneX
      useApiStatus
      style={{width: px2dp(500), backgroundColor: 'white'}}
      title={'选择账号'}
      hideLeft
      navStyle={{backgroundColor: 'white'}}
      titleStyle={{color: 'black'}}>
      <ScrollView style={{flex: 1}}>
        {allAccounts.length === 0 && <EmptyView emptyTitle={'账户为空'} />}
        {allAccounts.map(t => (
          <AccountItem
            key={t}
            accountId={t}
            onSelected={() => {
              onClose && onClose();
            }}
          />
        ))}
      </ScrollView>
      <View style={{minHeight: px2dp(400), marginTop: px2dp(20)}}>
        <CommonButton
          onPress={() => {
            onClose && onClose();
            RouteHelper.navigate('AddAccount');
          }}
          title={'添加钱包'}
          icon={'addfolder'}
        />
      </View>
    </BaseContainer>
  );
}

function AccountItem({accountId, onSelected}) {
  const {address} = keyring.getPair(accountId);
  const selectedAccount = useStoreState(
    state => state.accounts.selectedAccount,
  );
  const setSelectedAccount = useStoreActions(
    actions => actions.accounts.setSelectedAccount,
  );
  const isSelected = selectedAccount
    ? toHex(selectedAccount.address) === toHex(address)
    : false;
  return (
    <TouchableOpacity
      onPress={() => {
        onSelected && onSelected();
        setSelectedAccount(address);
      }}
      activeOpacity={0.7}
      style={[
        styles.items,
        {
          backgroundColor: isSelected ? theme.baseColor : 'white',
        },
      ]}>
      <Identicon value={address} size={px2dp(40)} />
      <View style={{flex: 1, marginLeft: px2dp(20)}}>
        <AccountName
          style={{color: isSelected ? 'white' : 'black', fontSize: 16}}
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  items: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: px2dp(20),
    height: px2dp(140),
    backgroundColor: 'white',
    borderWidth: theme.hairline,
    borderColor: theme.borderColor,
  },
});
