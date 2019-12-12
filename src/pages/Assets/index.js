/**
 * User: puti.
 * Time: 2019-12-11 15:03.
 */
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Identicon from '@polkadot/reactnative-identicon';
import BaseContainer from '../../components/BaseContainer';
import {Drawer} from 'teaset';
import AccountsDrawer from './AccountsDrawer';
import {showDecodeAddressQR} from '../../utils/base';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {useAccounts, useApi} from '../../hooks';
import CommonButton from '../../components/CommonButton';
import AddressText from '../../components/AddressText';
import Icon from '../../components/Icon';
import AccountName from '../../components/AccountName';
import AccountIndex from '../../components/AccountIndex';
import BestNumber from '../../components/BestNumber';
import RuntimeVersion from '../../components/RuntimeVersion';
import {icons} from '../../assets';
import {theme} from '../../config/theme';

export function Assets() {
  return (
    <BaseContainer
      title={'钱包'}
      useApiStatus
      leftIcon={'FontAwesome5/users'}
      rightIcon={'scan1'}
      rightPress={() => {
        showDecodeAddressQR().then(res => {});
      }}
      leftPress={() => {
        const drawer = Drawer.open(
          <AccountsDrawer
            onClose={() => {
              drawer.close();
            }}
          />,
        );
      }}
      useScrollView>
      <Header />
      <ChainInfo />
    </BaseContainer>
  );
}

function Section({title, style}) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          height: px2dp(50),
          marginTop: px2dp(40),
          marginBottom: px2dp(20),
          marginLeft: px2dp(25),
        },
        style,
      ]}>
      <View
        style={{
          width: px2dp(10),
          backgroundColor: theme.baseColor,
          height: '100%',
        }}
      />
      <Text style={{fontSize: 18, marginLeft: px2dp(20)}}>{title}</Text>
    </View>
  );
}

function ChainInfo() {
  const {systemChain} = useApi();
  return (
    <View>
      <Section title={'链信息'} />
      <View
        style={{
          flexDirection: 'row',
          marginTop: px2dp(30),
          alignItems: 'center',
          marginLeft: px2dp(25),
        }}>
        <Icon icon={icons.logo} size={px2dp(80)} />
        <View style={{marginLeft: px2dp(40)}}>
          <Text>{systemChain}</Text>
          <RuntimeVersion />
          <BestNumber label={'#'} />
        </View>
      </View>
    </View>
  );
}

function Header() {
  const allAccounts = useAccounts();
  const selectedAccount = useStoreState(
    state => state.accounts.selectedAccount,
  );
  const setSelectedAccount = useStoreActions(
    actions => actions.accounts.setSelectedAccount,
  );
  if (allAccounts.length !== 0 && !selectedAccount) {
    setSelectedAccount(allAccounts[0]);
  }
  return (
    <View style={styles.cardView}>
      {!selectedAccount ? (
        <>
          <Text style={{color: 'white', fontSize: 18}}>账户未创建</Text>
          <CommonButton onPress={() => {}} title={'前往创建'} />
        </>
      ) : (
        <>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
            }}>
            <Identicon size={px2dp(60)} value={selectedAccount.address} />
            <View style={{flex: 1, marginLeft: px2dp(20)}}>
              <AccountName
                style={{color: 'white', fontSize: 18}}
                params={selectedAccount.address}
              />
              <AccountIndex
                style={{color: 'white', fontSize: 14}}
                params={selectedAccount.address}
              />
              <AddressText
                style={{color: 'white', fontSize: 13, width: '80%'}}
                showCopyIcon
                address={selectedAccount.address}
              />
            </View>
            <TouchableOpacity style={{alignSelf: 'flex-start'}}>
              <Icon
                color={'white'}
                icon={'Feather/more-horizontal'}
                size={px2dp(60)}
              />
            </TouchableOpacity>
          </View>
          <View style={{marginTop: px2dp(20), flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1}} />
            <TouchableOpacity style={{alignSelf: 'flex-end'}}>
              <Icon color={'white'} icon={'qrcode'} size={px2dp(50)} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardView: {
    width: px2dp(700),
    backgroundColor: '#3288bd',
    minHeight: px2dp(300),
    alignSelf: 'center',
    borderRadius: px2dp(20),
    marginTop: px2dp(20),
    padding: px2dp(40),
  },
});
