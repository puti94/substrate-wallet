/**
 * User: puti.
 * Time: 2019-12-17 19:40.
 */
import React from 'react';
import {View, FlatList, Text} from 'react-native';
import {useApi, useRequest} from '../../../hooks';
import {getExtrinsic, getTransfer} from '../../../http/explorer';
import {toAddress} from '../../../utils/defaults';

export default function Transaction({accountId}) {
  const {api} = useApi();
  const [err, {data = []}, refresh] = useRequest(getExtrinsic, {
    address:
      'EEWyMLHgwtemr48spFNnS3U2XjaYswqAYAbadx2jr9ppp4X' || toAddress(accountId),
  });
  console.log('数据', accountId, err, data);
  return (
    <FlatList
      data={data}
      renderItem={({item}) => <TransactionsItem item={item} />}
    />
  );
}

function TransactionsItem({item}) {
  const {module_id, call_id, nonce} = item.attributes;
  return (
    <View style={{padding: px2dp(30), backgroundColor: 'white'}}>
      <Text>module:{module_id}</Text>
      <Text>call:{call_id}</Text>
      <Text>nonce:#{nonce}</Text>
    </View>
  );
}
