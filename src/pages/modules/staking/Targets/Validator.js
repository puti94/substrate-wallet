// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.v

import React from 'react';
import {Text, View} from 'react-native';
import {formatNumber} from '@polkadot/util';
import AddressItem from '../../../../components/AddressItem';
import FormatBalance from '../../../../components/FormatBalance';

export default function Validator({
  info: {
    accountId,
    bondOther,
    bondOwn,
    bondTotal,
    commissionPer,
    isCommission,
    isFavorite,
    isNominating,
    key,
    numNominators,
    rankOverall,
    rewardPayout,
    validatorPayment,
  },
}) {
  return (
    <AddressItem address={accountId}>
      <Text
        style={{
          position: 'absolute',
          right: px2dp(30),
          top: px2dp(20),
          fontSize: 18,
        }}>
        #{formatNumber(rankOverall)}
      </Text>
      <View style={{paddingLeft: px2dp(40), paddingBottom: px2dp(20)}}>
        {isCommission ? (
          <Text>commission:{`${commissionPer.toFixed(2)}%`}</Text>
        ) : (
          <FormatBalance
            label={<label>{t('commission')}</label>}
            value={validatorPayment}
          />
        )}
        <FormatBalance label={'total stake:'} value={bondTotal} />
        <FormatBalance label={'own stake:'} value={bondOwn} />
        <FormatBalance label={'other stake:'} value={bondOther}>
          ({formatNumber(numNominators)})
        </FormatBalance>
        <FormatBalance label={'payout (est.):'} value={rewardPayout} />
      </View>
    </AddressItem>
  );
}
