/**
 * User: puti.
 * Time: 2019-12-21 19:59.
 */
import BaseContainer from '../../../components/BaseContainer';
import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {useStoreState} from 'easy-peasy';
import AddressItem from '../../../components/AddressItem';
import {RouteHelper} from 'react-navigation-easy-helper';
import {useAccounts} from '../../../hooks';

export default function AddressBook({withAccount = false, onSelected}) {
  const {addressBookList} = useStoreState(state => state.set);
  const allAccounts = useAccounts();
  return (
    <BaseContainer
      title={'Address book'}
      rightIcon={'plus'}
      useScrollView
      rightPress={() => {
        RouteHelper.navigate('AddAddress');
      }}>
      {withAccount && (
        <>
          <Text style={styles.section}>ACCOUNTS</Text>
          {allAccounts.map(t => (
            <AddressItem
              onPress={() => {
                if (onSelected) {
                  onSelected(t);
                  RouteHelper.goBack();
                }
              }}
              key={t}
              address={t}
            />
          ))}
        </>
      )}
      <Text style={styles.section}>ADDRESS</Text>
      {addressBookList.map(t => (
        <AddressItem
          onPress={() => {
            if (onSelected) {
              onSelected(t.address);
              RouteHelper.goBack();
            }
          }}
          key={t.id}
          address={t.address}
          defaultName={t.name}
        />
      ))}
    </BaseContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    fontSize: 18,
    marginLeft: px2dp(40),
    marginVertical: px2dp(30),
  },
});
