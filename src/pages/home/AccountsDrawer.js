/**
 * User: puti.
 * Time: 2019-12-11 15:03.
 */
import React from 'react';
import {View, ScrollView} from 'react-native';
import BaseContainer from '../../components/BaseContainer';
import {useAccounts} from '../../hooks';
import CommonButton from '../../components/CommonButton';
import {EmptyView} from '../../components/EmptyView';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {toHex} from '../../utils/defaults';
import {RouteHelper} from 'react-navigation-easy-helper';
import AddressItem from '../../components/AddressItem';

export default function AccountsDrawer({onClose}) {
  const allAccounts = useAccounts();
  const selectedAccount = useStoreState(
    state => state.accounts.selectedAccount,
  );
  const setSelectedAccount = useStoreActions(
    actions => actions.accounts.setSelectedAccount,
  );
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
          <AddressItem
            key={t}
            isSelected={
              selectedAccount
                ? toHex(selectedAccount.address) === toHex(t)
                : false
            }
            address={t}
            onPress={() => {
              setSelectedAccount(t);
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
