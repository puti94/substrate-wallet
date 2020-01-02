// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {formatBalance} from '@polkadot/util';
import {useApi, useCall} from '../../../../hooks';
import CardSummary from '../../../../components/CardSummary';

export default function Summary({
  lastReward,
  totalStaked,
}: Props): React.ReactElement<Props> {
  const {api} = useApi();
  const totalInsurance = useCall(api.query.balances.totalIssuance, []);
  const [{percentage, staked}, setStakeInfo] = useState({
    percentage: '-',
    staked: null,
  });
  const [total, setTotal] = useState(null);

  useEffect((): void => {
    if (totalInsurance) {
      setTotal(
        `${formatBalance(totalInsurance, false)}${
          formatBalance.calcSi(totalInsurance.toString()).value
        }`,
      );
    }
  }, [totalInsurance]);

  useEffect((): void => {
    if (totalInsurance && totalStaked?.gtn(0)) {
      setStakeInfo({
        percentage: `${(
          totalStaked
            .muln(10000)
            .div(totalInsurance)
            .toNumber() / 100
        ).toFixed(2)}%`,
        staked: `${formatBalance(totalStaked, false)}${
          formatBalance.calcSi(totalStaked.toString()).value
        }`,
      });
    }
  }, [totalInsurance, totalStaked]);

  return (
    <View style={{padding: px2dp(40)}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <CardSummary label={'total staked:'}>{staked || '-'}</CardSummary>
        <CardSummary label="">/</CardSummary>
        <CardSummary label={'total issuance'}>{total || '-'}</CardSummary>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: px2dp(40),
        }}>
        <CardSummary label={'staked'}>{percentage}</CardSummary>
        <CardSummary label={'last reward'}>
          {lastReward.gtn(0) ? `${formatBalance(lastReward, false)}` : '-'}
        </CardSummary>
      </View>
    </View>
  );
}
