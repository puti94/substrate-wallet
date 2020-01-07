/**
 * User: puti.
 * Time: 2019-12-17 19:40.
 */
import BaseContainer from '../../../components/BaseContainer';
import React from 'react';
import {View} from 'react-native';
import {SegmentedView} from 'teaset';
import IdentityIcon from '@polkadot/reactnative-identicon';
import AddressText from '../../../components/AddressText';
import BalanceTransfer from './BalanceTransfer';
import Transaction from './Transaction';
import CommonButton from '../../../components/CommonButton';
import {theme} from '../../../config/theme';
import {RouteHelper} from 'react-navigation-easy-helper';
import BalanceFree from '../../../components/query/BalanceFree';

export default function AccountDetails({accountId}) {
  return (
    <BaseContainer title={'Details'}>
      <View style={{alignItems: 'center'}}>
        <IdentityIcon size={px2dp(80)} value={accountId} />
        <AddressText address={accountId} />
        <BalanceFree params={accountId} />
      </View>
      <SegmentedView
        indicatorType={'boxWidth'}
        justifyItem={'scrollable'}
        style={{flex: 1}}>
        <SegmentedView.Sheet title={'Balance transfer'}>
          <BalanceTransfer accountId={accountId} />
        </SegmentedView.Sheet>
        <SegmentedView.Sheet title={'Transactions'}>
          <Transaction accountId={accountId} />
        </SegmentedView.Sheet>
      </SegmentedView>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: px2dp(40),
          marginBottom: theme.bottomHeight,
        }}>
        <CommonButton
          style={{flex: 1, backgroundColor: '#3eaaa8', marginRight: px2dp(40)}}
          onPress={() => {
            RouteHelper.navigate('ReceiveQRCode', {
              address: accountId,
            });
          }}
          title={'收款'}
        />
        <CommonButton
          style={{flex: 1}}
          onPress={() => {
            RouteHelper.navigate('Transfer');
          }}
          title={'转账'}
        />
      </View>
    </BaseContainer>
  );
}
