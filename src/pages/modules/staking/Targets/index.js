// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {DerivedStakingElected} from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {createType} from '@polkadot/types';

import Summary from './Summary';
import Validator from './Validator';
import {registry} from '../../../../react-api/Api';
import {useAccounts, useApi, useCall} from '../../../../hooks';
import BaseContainer from '../../../../components/BaseContainer';

const PERBILL = new BN(1000000000);

function sortValidators(list) {
  return list
    .sort((a, b): number => b.bondTotal.cmp(a.bondTotal))
    .map((info, index) => {
      info.rankBonded = index + 1;

      return info;
    })
    .sort((a, b): number => b.validatorPayment.cmp(a.validatorPayment))
    .map((info, index) => {
      info.rankPayment = index + 1;

      return info;
    })
    .sort((a, b): number => a.rewardSplit.cmp(b.rewardSplit))
    .map((info, index) => {
      info.rankReward = index + 1;

      return info;
    })
    .sort(
      (a, b): number => {
        const cmp = b.rewardPayout.cmp(a.rewardPayout);

        return cmp !== 0
          ? cmp
          : a.rankReward === b.rankReward
          ? a.rankPayment === b.rankPayment
            ? a.rankBonded === b.rankBonded
              ? 0
              : a.rankBonded < b.rankBonded
              ? 1
              : -1
            : a.rankPayment < b.rankPayment
            ? 1
            : -1
          : a.rankReward < b.rankReward
          ? 1
          : -1;
      },
    )
    .map((info, index) => {
      info.rankOverall = index + 1;

      return info;
    })
    .sort(
      (a, b): number =>
        a.isFavorite === b.isFavorite ? 0 : a.isFavorite ? -1 : 1,
    );
}

function extractInfo(
  allAccounts,
  amount: BN = new BN(0),
  electedInfo: DerivedStakingElected,
  favorites,
  lastReward: BN,
) {
  let totalStaked = new BN(0);
  const perValidatorReward = lastReward.divn(electedInfo.info.length);
  const validators = sortValidators(
    electedInfo.info.map(({accountId, stakers, validatorPrefs}) => {
      const exposure = stakers || {
        total: createType(registry, 'Compact<Balance>'),
        own: createType(registry, 'Compact<Balance>'),
        others: createType(registry, 'Vec<IndividualExposure>'),
      };
      const prefs = validatorPrefs || {
        commission: createType(registry, 'Compact<Perbill>'),
      };
      const bondOwn = exposure.own.unwrap();
      const bondTotal = exposure.total.unwrap();
      const validatorPayment = prefs.validatorPayment
        ? prefs.validatorPayment.unwrap()
        : prefs.commission
            .unwrap()
            .mul(perValidatorReward)
            .div(PERBILL);
      const key = accountId.toString();
      const rewardSplit = perValidatorReward.sub(validatorPayment);
      const rewardPayout = rewardSplit.gtn(0)
        ? amount.mul(rewardSplit).div(amount.add(bondTotal))
        : new BN(0);
      const isNominating = exposure.others.reduce(
        (isNominating, indv): boolean => {
          return isNominating || allAccounts.includes(indv.who.toString());
        },
        allAccounts.includes(key),
      );

      totalStaked = totalStaked.add(bondTotal);

      return {
        accountId,
        bondOther: bondTotal.sub(bondOwn),
        bondOwn,
        bondShare: 0,
        bondTotal,
        isCommission: !!prefs.commission,
        isFavorite: favorites.includes(key),
        isNominating,
        key,
        commissionPer:
          (prefs.commission?.unwrap() || new BN(0))
            .muln(10000)
            .div(PERBILL)
            .toNumber() / 100,
        numNominators: exposure.others.length,
        rankBonded: 0,
        rankOverall: 0,
        rankPayment: 0,
        rankReward: 0,
        rewardPayout,
        rewardSplit,
        validatorPayment,
      };
    }),
  );

  return {totalStaked, validators};
}

export default function Targets() {
  const {api} = useApi();
  const allAccounts = useAccounts();
  const electedInfo = useCall(api.derive.staking.electedInfo, []);
  const [lastReward] = useState(new BN('1000000000'));
  const [{validators, totalStaked}, setWorkable] = useState({
    totalStaked: new BN(0),
    validators: [],
  });

  useEffect((): void => {
    if (electedInfo) {
      setWorkable(
        extractInfo(allAccounts, new BN(0), electedInfo, [], lastReward),
      );
    }
  }, [allAccounts, electedInfo, lastReward]);

  return (
    <BaseContainer
      navBar={null}
      useScrollView
      contentContainerStyle={{padding: px2dp(40)}}>
      <Summary lastReward={lastReward} totalStaked={totalStaked} />
      {validators.length ? (
        <>
          {validators.map(info => (
            <Validator info={info} key={info.key} />
          ))}
        </>
      ) : (
        <Text>Validator info not available</Text>
      )}
    </BaseContainer>
  );
}
