/**
 * User: puti.
 * Time: 2019-12-17 19:40.
 */
import BaseContainer from '../../../components/BaseContainer';
import React, {useEffect, useState} from 'react';
import {SegmentedView} from 'teaset';
import Overview from './Overview';
import {useAccounts, useApi, useCall} from '../../../hooks';
import Targets from './Targets';

function transformStakingControllers([stashes, controllers]) {
  return [
    stashes.map((accountId): string => accountId.toString()),
    controllers
      .filter((optId): boolean => optId.isSome)
      .map((accountId): string => accountId.unwrap().toString()),
  ];
}

export default function Staking() {
  const {api, isSubstrateV2} = useApi();
  const accounts = useAccounts();
  const hasAccounts = accounts.length !== 0;
  const [next, setNext] = useState([]);
  const [allStashes, allControllers] = useCall(
    api.derive.staking.controllers,
    [],
    {
      defaultValue: [[], []],
      transform: transformStakingControllers,
    },
  );
  const stakingOverview = useCall(api.derive.staking.overview, []);
  // const sessionRewards = useSessionRewards(MAX_SESSIONS);
  const hasQueries = hasAccounts && !!api.query.imOnline?.authoredBlocks;
  const recentlyOnline = useCall(api.derive.imOnline.receivedHeartbeats, []);
  const validators = stakingOverview?.validators;
  useEffect((): void => {
    validators &&
      setNext(
        isSubstrateV2
          ? // this is a V2 node currentValidators is a list of stashes
            allStashes.filter(
              (address): boolean => !validators.includes(address),
            )
          : // this is a V1 node currentValidators is a list of controllers
            allControllers.filter(
              (address): boolean => !validators.includes(address),
            ),
      );
  }, [allControllers, allStashes, isSubstrateV2, validators]);

  return (
    <BaseContainer title={'Staking'}>
      <SegmentedView
        indicatorType={'boxWidth'}
        justifyItem={'scrollable'}
        style={{flex: 1}}>
        <SegmentedView.Sheet title={'Overview'}>
          <Overview
            hasQueries={hasQueries}
            recentlyOnline={recentlyOnline}
            stakingOverview={stakingOverview}
            next={next}
          />
        </SegmentedView.Sheet>
        <SegmentedView.Sheet title={'Returns'}>
          <Targets />
        </SegmentedView.Sheet>
        <SegmentedView.Sheet title={'Account actions'} />
      </SegmentedView>
    </BaseContainer>
  );
}
