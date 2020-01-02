// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, {useEffect, useState} from 'react';

import {formatNumber} from '@polkadot/util';
import {useApi, useCall} from '../../../hooks';
import CardSummary from '../../../components/CardSummary';

type Props = {
  sessionInfo?: any,
  withEra?: boolean,
  withSession?: boolean,
};

function renderSession({
  sessionInfo,
  withSession = true,
}: Props): React.ReactNode {
  if (!withSession || !sessionInfo) {
    return null;
  }

  const label =
    sessionInfo.isEpoch && sessionInfo.sessionLength.gtn(1)
      ? 'epoch'
      : 'session';
  return sessionInfo.sessionLength.gtn(0) ? (
    <CardSummary
      label={label}
      progress={{
        total: sessionInfo.sessionLength,
        value: sessionInfo.sessionProgress,
      }}
    />
  ) : (
    <CardSummary label={label}>
      {formatNumber(sessionInfo.currentIndex)}
    </CardSummary>
  );
}

function renderEra({sessionInfo, withEra = true}: Props): React.ReactNode {
  if (!withEra || !sessionInfo) {
    return null;
  }

  const label = 'era';

  return sessionInfo.sessionLength.gtn(0) ? (
    <CardSummary
      label={label}
      progress={{
        total: sessionInfo.eraLength,
        value: sessionInfo.eraProgress,
      }}
    />
  ) : (
    <CardSummary label={label}>
      {formatNumber(sessionInfo.currentEra)}
    </CardSummary>
  );
}

function SummarySession(props: Props): React.ReactElement<Props> {
  const {api} = useApi();
  const sessionInfo = useCall(api.derive.session.info, [], {debug: true});
  const [expanded, setExpanded] = useState(props);

  useEffect((): void => {
    setExpanded({...props, sessionInfo});
  }, [props, sessionInfo, setExpanded]);

  return (
    <>
      {renderSession(expanded)}
      {renderEra(expanded)}
    </>
  );
}

export default SummarySession;
