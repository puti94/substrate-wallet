// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, {useEffect, useState} from 'react';
import {HeaderExtended} from '@polkadot/api-derive';
import {formatNumber} from '@polkadot/util';
import {useApi} from '../../hooks';

const MAX_HEADERS = 25;

const byAuthor: Record<string, string> = {};
const BlockAuthorsContext: React.Context = React.createContext({
  byAuthor,
  lastHeaders: [],
});
const ValidatorsContext: React.Context = React.createContext([]);

function BlockAuthors({children}) {
  const {api} = useApi();
  const [state, setState] = useState({byAuthor, lastHeaders: []});
  const [validators, setValidators] = useState([]);

  useEffect((): void => {
    let subscriber;
    api.isReady.then(() => {
      let lastHeaders = [];
      let lastBlockAuthors = [];
      let lastBlockNumber = '';

      // subscribe to all validators
      api.query.session &&
        api.query.session.validators(
          (validatorIds): void => {
            setValidators(
              validatorIds.map((validatorId): string => validatorId.toString()),
            );
          },
        );

      // subscribe to new headers
      subscriber = api.derive.chain.subscribeNewHeads(lastHeader => {
        if (lastHeader && lastHeader.number) {
          const blockNumber = lastHeader.number.unwrap();
          const thisBlockAuthor = lastHeader.author?.toString();
          const thisBlockNumber = formatNumber(blockNumber);

          if (thisBlockAuthor) {
            byAuthor[thisBlockAuthor] = thisBlockNumber;

            if (thisBlockNumber !== lastBlockNumber) {
              lastBlockNumber = thisBlockNumber;
              lastBlockAuthors = [thisBlockAuthor];
            } else {
              lastBlockAuthors.push(thisBlockAuthor);
            }
          }

          lastHeaders = lastHeaders
            .filter(
              (old, index): boolean =>
                index < MAX_HEADERS && old.number.unwrap().lt(blockNumber),
            )
            .reduce(
              (next, header): HeaderExtended[] => {
                next.push(header);

                return next;
              },
              [lastHeader],
            )
            .sort((a, b) => b.number.unwrap().cmp(a.number.unwrap()));

          setState({
            byAuthor,
            lastBlockAuthors: lastBlockAuthors.slice(),
            lastBlockNumber,
            lastHeader,
            lastHeaders,
          });
        }
      });
    });
    return () => {
      if (subscriber) {
        subscriber.then(unsub => unsub());
      }
    };
  }, [api]);

  return (
    <ValidatorsContext.Provider value={validators}>
      <BlockAuthorsContext.Provider value={state}>
        {children}
      </BlockAuthorsContext.Provider>
    </ValidatorsContext.Provider>
  );
}

export {BlockAuthorsContext, BlockAuthors, ValidatorsContext};
