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
import {theme} from '../../config/theme';
import ChainImg from '../../components/ChainImg';
import {RouteHelper} from 'react-navigation-easy-helper';
import {STORE_ACCOUNT_SELECTED} from '../../config';
import Available from '../../components/query/Available';
import AddressInfo from '../../components/AddressInfo';

export default function Home() {
  return (
    <BaseContainer
      title={'钱包'}
      useApiStatus
      leftIcon={'FontAwesome5/users'}
      rightIcon={'scan1'}
      rightPress={() => {
        showDecodeAddressQR().then(res => {
          RouteHelper.navigate('Transfer', {receipt: res.address});
        });
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
      <AccountInfo />
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
          flex: 1,
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
        <ChainImg size={px2dp(80)} />
        <View style={{marginLeft: px2dp(20)}}>
          <Text>{systemChain}</Text>
          <RuntimeVersion />
          <BestNumber label={'#'} />
        </View>
      </View>
    </View>
  );
}

function AccountInfo() {
  const selectedAccount = useStoreState(
    state => state.accounts.selectedAccount,
  );
  if (!selectedAccount) {
    return null;
  }
  return (
    <View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Section title={'账户信息'} />
        <TouchableOpacity
          style={{marginTop: px2dp(30), marginRight: px2dp(40)}}>
          <Icon
            icon={'MaterialCommunityIcons/flip-to-front'}
            size={px2dp(50)}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: px2dp(30),
          alignItems: 'center',
          marginLeft: px2dp(25),
        }}>
        <View style={{marginLeft: px2dp(20)}}>
          <AddressInfo address={selectedAccount.address} />
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
    const address = localStorage.getItem(STORE_ACCOUNT_SELECTED);
    setSelectedAccount(address || allAccounts[0]);
  }
  return (
    <View style={styles.cardView}>
      {!selectedAccount ? (
        <>
          <Text style={{color: 'white', fontSize: 18}}>账户为空</Text>
          <CommonButton
            icon={'addfolder'}
            onPress={() => {
              RouteHelper.navigate('AddAccount');
            }}
            title={'添加钱包'}
          />
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
            <TouchableOpacity
              style={{alignSelf: 'flex-start'}}
              onPress={() => RouteHelper.navigate('AccountSet')}>
              <Icon
                color={'white'}
                icon={'Feather/more-horizontal'}
                size={px2dp(60)}
              />
            </TouchableOpacity>
          </View>
          <View style={{marginTop: px2dp(20), flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Available
                style={{
                  alignSelf: 'flex-end',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 22,
                  marginLeft: px2dp(30),
                }}
                params={selectedAccount.address}
              />
            </View>
            <TouchableOpacity
              style={{alignSelf: 'flex-end'}}
              onPress={() => {
                RouteHelper.navigate('ReceiveQRCode', {
                  address: selectedAccount.address,
                });
              }}>
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
