// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {useEffect, useState} from 'react';
import {useApi, useCacheKey, useIsMountedRef} from '../../../hooks';
import {createType} from '@polkadot/types';
import {bnMax, u8aToU8a} from '@polkadot/util';
import BN from 'bn.js';
import {registry} from '../../../react-api/Api';

const MAX_BLOCKS = 2500;

function fromJSON(sessions) {
  let keepAll = false;

  return (
    sessions
      .map(
        ({
          blockHash,
          blockNumber,
          isEventsEmpty,
          parentHash,
          reward,
          sessionIndex,
          slashes,
          treasury,
        }) => ({
          blockHash: createType(registry, 'Hash', blockHash),
          blockNumber: createType(registry, 'BlockNumber', blockNumber),
          isEventsEmpty,
          parentHash: createType(registry, 'Hash', parentHash),
          reward: createType(registry, 'Balance', reward),
          sessionIndex: createType(registry, 'SessionIndex', sessionIndex),
          slashes: slashes.map(({accountId, amount}) => ({
            accountId: createType(registry, 'AccountId', accountId),
            amount: createType(registry, 'Balance', amount),
          })),
          treasury: createType(registry, 'Balance', treasury),
        }),
      )
      .filter(({parentHash}): boolean => !parentHash.isEmpty)
      .reverse()
      // we drop everything before the last reward
      .filter(
        ({reward}): boolean => {
          if (reward.gtn(0)) {
            keepAll = true;
          }

          return keepAll;
        },
      )
      .reverse()
  );
}

function toJSON(sessions, maxSessions) {
  return sessions
    .map(
      ({
        blockHash,
        blockNumber,
        isEventsEmpty,
        parentHash,
        reward,
        sessionIndex,
        slashes,
        treasury,
      }) => ({
        blockHash: blockHash.toHex(),
        blockNumber: blockNumber.toHex(),
        isEventsEmpty,
        parentHash: parentHash.toHex(),
        reward: reward.toHex(),
        sessionIndex: sessionIndex.toHex(),
        slashes: slashes.map(
          ({accountId, amount}): SerializedSlash => ({
            accountId: accountId.toString(),
            amount: amount.toHex(),
          }),
        ),
        treasury: treasury.toHex(),
      }),
    )
    .slice(-maxSessions);
}

function mergeResults(sessions, newSessions) {
  const tmp = sessions
    .concat(newSessions)
    .sort((a, b): number => a.blockNumber.cmp(b.blockNumber));

  // for the first, always use it, otherwise ignore on same sessionIndex
  return tmp.filter(
    ({sessionIndex}, index): boolean =>
      index === 0 || !tmp[index - 1].sessionIndex.eq(sessionIndex),
  );
}

async function loadSome(api, fromHash, toHash) {
  // query a range of blocks - on non-archive nodes this will fail, so return an empty set
  const results = await api.rpc.state
    .queryStorage([api.query.session.currentIndex.key()], fromHash, toHash)
    .catch(() => []);
  const headers = await Promise.all(
    results.map(({block}) => api.rpc.chain.getHeader(block)),
  );
  const events = await Promise.all(
    results.map(
      ({block}) =>
        api.query.system.events
          .at(block)
          .then(records =>
            records.filter(
              ({event: {section}}): boolean => section === 'staking',
            ),
          )
          .catch(() => []), // may throw, update metadata for old
    ),
  );
  const slashes = events.map(info =>
    info
      .filter(({event: {method}}): boolean => method === 'Slash')
      .map(({event: {data: [accountId, amount]}}) => ({
        accountId: accountId,
        amount: amount,
      })),
  );
  const rewards = events.map(info => {
    const rewards = info.filter(
      ({event: {method}}): boolean => method === 'Reward',
    );

    return [rewards[0]?.event?.data[0], rewards[0]?.event?.data[1]];
  });

  // For old v1, the query results have empty spots (subsequently fixed in v2),
  // filter these before trying to extract the results
  return results
    .filter(({changes}): boolean => !!(changes && changes.length))
    .map(({changes: [[, value]]}, index) => ({
      blockHash: headers[index].hash,
      blockNumber: headers[index].number.unwrap(),
      isEventsEmpty: events[index].length === 0,
      parentHash: headers[index].parentHash,
      reward: rewards[index][0] || createType(registry, 'Balance'),
      sessionIndex: createType(
        registry,
        'SessionIndex',
        u8aToU8a(value.isSome ? value.unwrap() : new Uint8Array([])),
      ),
      slashes: slashes[index],
      treasury: rewards[index][1] || createType(registry, 'Balance'),
    }));
}

export default function useSessionRewards(maxSessions: number) {
  const {api} = useApi();
  const mounted = useIsMountedRef();
  const [getCache, setCache] = useCacheKey('hooks:sessionSlashes');
  const [filtered, setFiltered] = useState([]);

  useEffect((): void => {
    let workQueue = fromJSON(getCache() || []);
    const savedNumber = workQueue[workQueue.length - 1]
      ? workQueue[workQueue.length - 1].blockNumber
      : undefined;

    setImmediate(
      (): void => {
        api.isReady.then(async () => {
          const maxSessionsStore = maxSessions + 1; // assuming first is a bust
          const bestHeader = await api.rpc.chain.getHeader();
          let toHash = bestHeader.hash;
          let toNumber = bestHeader.number.unwrap().toBn();
          let fromNumber = bnMax(toNumber.subn(MAX_BLOCKS), new BN(1));

          while (true) {
            // console.log(`Updating rewards cache, #${fromNumber} -> #${toNumber}`);

            const fromHash = await api.rpc.chain.getBlockHash(fromNumber);
            const newQueue = await loadSome(api, fromHash, toHash);

            workQueue = mergeResults(workQueue, newQueue);
            toHash = fromHash;
            toNumber = fromNumber;
            fromNumber = bnMax(toNumber.subn(MAX_BLOCKS), new BN(1));

            if (mounted.current) {
              setCache(toJSON(workQueue, maxSessionsStore));
              setFiltered(workQueue.slice(-maxSessions));
            }

            const lastNumber = workQueue[workQueue.length - 1]?.blockNumber;

            if (
              !mounted.current ||
              !lastNumber ||
              fromNumber.eqn(1) ||
              (workQueue.length >= maxSessionsStore &&
                fromNumber.lt(savedNumber || lastNumber))
            ) {
              break;
            }
          }
        });
      },
    );
  }, [api, getCache, maxSessions, mounted, setCache]);

  return filtered;
}
