// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {bnToBn} from '@polkadot/util';

const TICK_TIMEOUT = 100;
const tickers = new Map();

let lastNow = Date.now();
let lastId = 0;

function tick(): void {
  lastNow = Date.now();

  for (const ticker of tickers.values()) {
    ticker(lastNow);
  }

  setTimeout(tick, TICK_TIMEOUT);
}

function getDisplayValue(now = 0, value: BN | Date | number = 0): string {
  const tsValue =
    (value && value.getTime ? value.getTime() : bnToBn(value).toNumber()) || 0;
  let display = '0.0s';

  if (now && tsValue) {
    const elapsed = Math.max(Math.abs(now - tsValue), 0) / 1000;

    if (elapsed < 15) {
      display = `${elapsed.toFixed(1)}s`;
    } else if (elapsed < 60) {
      display = `${elapsed | 0}s`;
    } else if (elapsed < 3600) {
      display = `${(elapsed / 60) | 0}m`;
    } else {
      display = `${(elapsed / 3600) | 0}h`;
    }
  }

  return display;
}

tick();

export default function Elapsed({style, value}) {
  const [now, setNow] = useState(lastNow);

  useEffect((): (() => void) => {
    const id = lastId++;

    tickers.set(id, setNow);

    return (): void => {
      tickers.delete(id);
    };
  }, []);

  return <Text style={style}>{getDisplayValue(now, value)}</Text>;
}
