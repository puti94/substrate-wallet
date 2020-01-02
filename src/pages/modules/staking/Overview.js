/**
 * User: puti.
 * Time: 2019-12-17 19:40.
 */
import BaseContainer from '../../../components/BaseContainer';
import React, {useContext, useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import CardSummary from '../../../components/CardSummary';
import {BlockAuthorsContext} from '../../../components/query/BlockAuthors';
import SummarySession from '../explorer/SummarySession';
import {useAccounts, useApi, useCall} from '../../../hooks';
import SimpleTab from '../../../components/SimpleTab';
import AddressItem from '../../../components/AddressItem';
import FormatBalance from '../../../components/FormatBalance';
import {formatNumber} from '@polkadot/util';
function filterAccounts(accounts = [], elected, favorites, without, eraPoints) {
  return (accounts || [])
    .filter((accountId): boolean => !without.includes(accountId))
    .sort(
      (a, b): number => {
        const isFavA = favorites.includes(a);
        const isFavB = favorites.includes(b);

        return isFavA === isFavB ? 0 : isFavA ? -1 : 1;
      },
    )
    .map(accountId => {
      const electedIdx = elected.indexOf(accountId);

      return [
        accountId,
        elected.includes(accountId),
        favorites.includes(accountId),
        electedIdx !== -1 ? eraPoints?.individual[electedIdx] : undefined,
      ];
    });
}

function accountsToString(accounts) {
  return (accounts || []).map((accountId): string => accountId.toString());
}

export default function Overview({stakingOverview, next}) {
  const {isSubstrateV2} = useApi();
  const {lastBlockNumber} = useContext(BlockAuthorsContext);
  const _elected = accountsToString(stakingOverview?.currentElected);
  const _validators = accountsToString(stakingOverview?.validators);
  const [tabIndex, setTabIndex] = useState(0);
  const validators = filterAccounts(
    _validators,
    _elected,
    [],
    [],
    stakingOverview?.eraPoints,
  );
  const elected = isSubstrateV2
    ? filterAccounts(_elected, _elected, [], _validators)
    : [];
  const waiting = filterAccounts(next, [], [], _elected);
  return (
    <BaseContainer
      navBar={null}
      useScrollView
      contentContainerStyle={{padding: px2dp(40)}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        {!!stakingOverview && (
          <CardSummary label={'validators'} style={{flex: 1}}>
            {stakingOverview.validators.length}
            {`/${stakingOverview.validatorCount.toString()}`}
          </CardSummary>
        )}
        {!!next && (
          <CardSummary label={'waiting'} style={{flex: 1}}>
            {next.length}
          </CardSummary>
        )}
        <CardSummary label={'last block'} style={{flex: 1}}>
          {lastBlockNumber}
        </CardSummary>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: px2dp(30),
        }}>
        <SummarySession style={{flex: 1}} />
      </View>
      <SimpleTab
        tabs={['validators', 'next up']}
        index={tabIndex}
        setTabIndex={setTabIndex}
      />
      {tabIndex === 0 && <AddressRow addresses={validators} />}
      {tabIndex === 1 && <AddressRow events={[...elected, ...waiting]} />}
    </BaseContainer>
  );
}

function AddressRow({addresses = []}) {
  if (addresses.length === 0) {
    return <Text>no addresses found</Text>;
  }
  return addresses.map(([address, isElected, isFavorite, points]) => (
    <Address points={points} address={address} />
  ));
}

function Address({address, withNominations, points, filter}) {
  const {api} = useApi();
  const stakingInfo = useCall(api.derive.staking.query, [address]);
  const {byAuthor} = useContext(BlockAuthorsContext);
  const myAccounts = useAccounts();
  const [
    {
      commission,
      hasNominators,
      isNominatorMe,
      nominators,
      stashId,
      stakeOwn,
      stakeOther,
      validatorPayment,
    },
    setStakingState,
  ] = useState({
    hasNominators: false,
    isNominatorMe: false,
    nominators: [],
    stashId: address.toString(),
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect((): void => {
    if (stakingInfo) {
      const {
        controllerId,
        nextSessionIds,
        stakers,
        stashId,
        validatorPrefs,
      } = stakingInfo;
      const nominators =
        withNominations && stakers
          ? stakers.others.map(({who, value}) => [who, value.unwrap()])
          : [];
      const stakeTotal =
        (stakers && !stakers.total.isEmpty && stakers.total.unwrap()) ||
        undefined;
      const stakeOwn =
        (stakers && !stakers.own.isEmpty && stakers.own.unwrap()) || undefined;
      const stakeOther =
        stakeTotal && stakeOwn ? stakeTotal.sub(stakeOwn) : undefined;
      const commission = validatorPrefs?.commission?.unwrap();

      setStakingState({
        commission: commission
          ? `${(commission.toNumber() / 10000000).toFixed(2)}%`
          : undefined,
        controllerId: controllerId?.toString(),
        hasNominators: nominators.length !== 0,
        isNominatorMe: nominators.some(
          ([who]): boolean => myAccounts.includes(who.toString()),
        ),
        nominators,
        sessionId: nextSessionIds && nextSessionIds[0]?.toString(),
        stashId: (stashId || address).toString(),
        stakeOther,
        stakeOwn,
        stakeTotal,
        validatorPayment: validatorPrefs?.validatorPayment?.unwrap(),
      });
    }
  }, [address, myAccounts, stakingInfo, withNominations]);
  const lastBlockNumber = byAuthor[stashId];

  return (
    <AddressItem address={address}>
      <View style={{paddingLeft: px2dp(40), paddingBottom: px2dp(30)}}>
        <FormatBalance label={'own stake:'} value={stakeOwn} />
        <FormatBalance label={'other stake:'} value={stakeOther} />
        {(commission || validatorPayment) &&
          (commission ? (
            <Text>commission:{commission}</Text>
          ) : (
            <FormatBalance label={'commission:'} value={validatorPayment} />
          ))}
        <Text>points:{formatNumber(points)}</Text>
        <Text>last #:{lastBlockNumber}</Text>
      </View>
    </AddressItem>
  );
}
