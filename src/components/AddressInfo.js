// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  DerivedBalances,
  DerivedStakingAccount,
} from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React from 'react';
import {View, Text} from 'react-native';
import {formatNumber, isObject} from '@polkadot/util';
import AddressText from './AddressText';
import FormatBalance from './FormatBalance';
import Label from './Label';
import {useAccounts} from '../hooks';
import {withCalls} from '../react-api/with';

// true to display, or (for bonded) provided values [own, ...all extras]
export type BalanceActiveType = {
  available?: boolean,
  bonded?: boolean | BN[],
  extraInfo?: [React.ReactNode, React.ReactNode][],
  locked?: boolean,
  redeemable?: boolean,
  reserved?: boolean,
  total?: boolean,
  unlocking?: boolean,
  vested?: boolean,
};

export type CryptoActiveType = {
  crypto?: boolean,
  nonce?: boolean,
};

export type ValidatorPrefsType = {
  unstakeThreshold?: boolean,
  validatorPayment?: boolean,
};

const PERBILL = new BN(1000000000);

type Props = {
  address: string,
  balancesAll?: DerivedBalances,
  children?: React.ReactNode,
  extraInfo?: [string, string][],
  stakingInfo?: DerivedStakingAccount,
  withBalance?: boolean | BalanceActiveType,
  withBalanceToggle?: false,
  withExtended?: boolean | CryptoActiveType,
  withHexSessionId?: (string | null)[],
  withRewardDestination?: boolean,
  withValidatorPrefs?: boolean | ValidatorPrefsType,
};

const DEFAULT_BALANCES: BalanceActiveType = {
  available: true,
  bonded: true,
  locked: true,
  redeemable: true,
  reserved: true,
  total: true,
  unlocking: true,
  vested: true,
};
const DEFAULT_EXTENDED = {
  crypto: true,
  nonce: true,
};
const DEFAULT_PREFS = {
  unstakeThreshold: true,
  validatorPayment: true,
};

// skip balances retrieval of none of this matches
function skipBalancesIf({
  withBalance = true,
  withExtended = false,
}: Props): boolean {
  if (withBalance === true || withExtended === true) {
    return false;
  } else if (isObject(withBalance)) {
    // these all pull from the all balances
    if (
      withBalance.available ||
      withBalance.locked ||
      withBalance.reserved ||
      withBalance.total ||
      withBalance.vested
    ) {
      return false;
    }
  } else if (isObject(withExtended)) {
    if (withExtended.nonce) {
      return false;
    }
  }

  return true;
}

function skipStakingIf({
  stakingInfo,
  withBalance = true,
  withRewardDestination = false,
  withValidatorPrefs = false,
}: Props): boolean {
  if (stakingInfo) {
    return true;
  } else if (
    withBalance === true ||
    withValidatorPrefs ||
    withRewardDestination
  ) {
    return false;
  } else if (isObject(withBalance)) {
    if (withBalance.unlocking || withBalance.redeemable) {
      return false;
    } else if (withBalance.bonded) {
      return Array.isArray(withBalance.bonded);
    }
  }

  return true;
}

// calculates the bonded, first being the own, the second being nominated
function calcBonded(
  stakingInfo?: DerivedStakingAccount,
  bonded?: boolean | BN[],
): [BN, BN[]] {
  let other: BN[] = [];
  let own = new BN(0);

  if (Array.isArray(bonded)) {
    other = bonded
      .filter((_, index): boolean => index !== 0)
      .filter((value): boolean => value.gtn(0));

    own = bonded[0];
  } else if (
    stakingInfo &&
    stakingInfo.stakingLedger &&
    stakingInfo.accountId.eq(stakingInfo.stashId)
  ) {
    own = stakingInfo.stakingLedger.active.unwrap();
  }

  return [own, other];
}

function renderExtended({
  balancesAll,
  t,
  address,
  withExtended,
}: Props): React.ReactNode {
  const extendedDisplay =
    withExtended === true ? DEFAULT_EXTENDED : withExtended || undefined;

  if (!extendedDisplay) {
    return null;
  }

  return (
    <View>
      {balancesAll && extendedDisplay.nonce && (
        <>
          <Text>transactions</Text>
          <div className="result">{formatNumber(balancesAll.accountNonce)}</div>
        </>
      )}
      {extendedDisplay.crypto && (
        <>
          <Text>type</Text>
          <AddressText address={address} />
        </>
      )}
    </View>
  );
}

function renderUnlocking({stakingInfo, t}: Props): React.ReactNode {
  if (!stakingInfo || !stakingInfo.unlocking || !stakingInfo.unlocking.length) {
    return null;
  }

  const total = stakingInfo.unlocking.reduce(
    (total, {value}): BN => total.add(value),
    new BN(0),
  );

  if (total.eqn(0)) {
    return null;
  }

  return (
    <View>
      <FormatBalance value={total} />
    </View>
  );
}

function renderValidatorPrefs({
  stakingInfo,
  t,
  withValidatorPrefs = false,
}: Props): React.ReactNode {
  const validatorPrefsDisplay =
    withValidatorPrefs === true ? DEFAULT_PREFS : withValidatorPrefs;

  if (!validatorPrefsDisplay || !stakingInfo || !stakingInfo.validatorPrefs) {
    return null;
  }

  return (
    <>
      <View />
      {validatorPrefsDisplay.unstakeThreshold &&
        stakingInfo.validatorPrefs.unstakeThreshold && (
          <>
            <Label label={t('unstake threshold')} />
            <div className="result">
              {stakingInfo.validatorPrefs.unstakeThreshold.toString()}
            </div>
          </>
        )}
      {validatorPrefsDisplay.validatorPayment &&
        (stakingInfo.validatorPrefs.commission ||
          stakingInfo.validatorPrefs.validatorPayment) &&
        (stakingInfo.validatorPrefs.validatorPayment ? (
          <>
            <Label label={t('commission')} />
            <FormatBalance
              className="result"
              value={stakingInfo.validatorPrefs.validatorPayment}
            />
          </>
        ) : (
          <>
            <Label label={t('commission')} />
            <span>
              {(
                stakingInfo.validatorPrefs.commission
                  .unwrap()
                  .muln(10000)
                  .div(PERBILL)
                  .toNumber() / 100
              ).toFixed(2)}
              %
            </span>
          </>
        ))}
    </>
  );
}

function renderBalances(props: Props, allAccounts: string[]): React.ReactNode {
  const {
    balancesAll,
    stakingInfo,
    withBalance = true,
    withBalanceToggle = false,
  } = props;
  const balanceDisplay =
    withBalance === true ? DEFAULT_BALANCES : withBalance || false;

  if (!balanceDisplay) {
    return null;
  }

  const [ownBonded, otherBonded] = calcBonded(
    stakingInfo,
    balanceDisplay.bonded,
  );

  const allItems = (
    <>
      {balancesAll && balanceDisplay.total && (
        <>
          <Label label={'total'} />
          <FormatBalance value={balancesAll.votingBalance} />
        </>
      )}
      {balancesAll && balanceDisplay.available && (
        <>
          <Label label={'transferrable'} />
          <FormatBalance
            className="result"
            value={balancesAll.availableBalance}
          />
        </>
      )}
      {balanceDisplay.vested && balancesAll?.isVesting && (
        <>
          <Label label={'vested'} />
          <FormatBalance value={balancesAll.vestedBalance} />
        </>
      )}
      {balanceDisplay.locked && balancesAll?.lockedBalance?.gtn(0) && (
        <>
          <Label label={'locked'} />
          <FormatBalance value={balancesAll.lockedBalance} />
        </>
      )}
      {balanceDisplay.reserved && balancesAll?.reservedBalance?.gtn(0) && (
        <>
          <Label label={'reserved'} />
          <FormatBalance value={balancesAll.reservedBalance} />
        </>
      )}
      {balanceDisplay.bonded && (ownBonded.gtn(0) || otherBonded.length !== 0) && (
        <>
          <Label label={'bonded'} />
          <FormatBalance value={ownBonded}>
            {otherBonded.length !== 0 && (
              <Text>
                (+
                {otherBonded.map((bonded, index) => (
                  <FormatBalance key={index} value={bonded} />
                ))}
                )
              </Text>
            )}
          </FormatBalance>
        </>
      )}
      {balanceDisplay.redeemable && stakingInfo?.redeemable?.gtn(0) && (
        <>
          <Label label={'redeemable'} />
          <FormatBalance value={stakingInfo.redeemable} />
        </>
      )}
      {balanceDisplay.unlocking && stakingInfo?.unlocking && (
        <>
          <Label label={'unbonding'} />
          <div className="result">{renderUnlocking(props)}</div>
        </>
      )}
    </>
  );

  if (withBalanceToggle) {
    return (
      <>
        <Text>{'balances'}</Text>
        <FormatBalance value={balancesAll?.votingBalance} />
        <Text>{allItems}</Text>
      </>
    );
  }

  return <>{allItems}</>;
}

export default withCalls(
  [
    'derive.balances.all',
    {
      paramName: 'address',
      propName: 'balancesAll',
      skipIf: skipBalancesIf,
    },
  ],
  [
    'derive.staking.account',
    {
      paramName: 'address',
      propName: 'stakingInfo',
      skipIf: skipStakingIf,
    },
  ],
)(function AddressInfo(props: Props): React.ReactElement<Props> {
  const {allAccounts} = useAccounts();
  const {
    children,
    extraInfo,
    stakingInfo,
    withHexSessionId,
    withRewardDestination,
  } = props;

  return (
    <View>
      <View>
        {renderBalances(props, allAccounts)}
        {withHexSessionId && withHexSessionId[0] && (
          <>
            <Label label={'session keys'} />
            <Text>{withHexSessionId[0]}</Text>
          </>
        )}
        {withHexSessionId && withHexSessionId[0] !== withHexSessionId[1] && (
          <>
            <Label label={'session next'} />
            <Text>{withHexSessionId[1]}</Text>
          </>
        )}
        {renderValidatorPrefs(props)}
        {extraInfo && (
          <>
            <View />
            {extraInfo.map(
              ([label, value], index): React.ReactNode => (
                <React.Fragment key={`label:${index}`}>
                  <Label label={label} />
                  <Text>{value}</Text>
                </React.Fragment>
              ),
            )}
          </>
        )}
        {withRewardDestination && stakingInfo && stakingInfo.rewardDestination && (
          <>
            <Label label={'rewards'} />
            <Text>
              {stakingInfo.rewardDestination.toString().toLowerCase()}
            </Text>
          </>
        )}
      </View>
      {renderExtended(props)}
      {children && <View className="column">{children}</View>}
    </View>
  );
});
