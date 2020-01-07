/**
 * User: puti.
 * Time: 2019-12-17 19:40.
 */
import React from 'react';
import {View, FlatList, Text} from 'react-native';
import {useApi, useRequest} from '../../../hooks';
import {getTransfer} from '../../../http/explorer';
import {toAddress} from '../../../utils/defaults';
import FormatBalance from '../../../components/FormatBalance';
import AddressText from '../../../components/AddressText';

export default function BalanceTransfer({accountId}) {
  const {api} = useApi();
  const [err, {data = []}, refresh] = useRequest(getTransfer, {
    address:
      'EEWyMLHgwtemr48spFNnS3U2XjaYswqAYAbadx2jr9ppp4X' || toAddress(accountId),
  });
  console.log('数据', accountId, err, data);
  return (
    <FlatList
      data={data}
      renderItem={({item}) => (
        <TransferItem item={item} accountId={accountId} />
      )}
    />
  );
}

function TransferItem({item, accountId}) {
  const {value, fee, destination, sender} = item.attributes;
  console.log('destination', destination);
  const isSender =
    toAddress(accountId) === toAddress(sender.attributes.address);
  return (
    <View style={{padding: px2dp(30), backgroundColor: 'white'}}>
      <AddressText
        address={
          isSender ? destination.attributes.address : sender.attributes.address
        }
      />
      <FormatBalance value={value} />
    </View>
  );
}
