// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, {useEffect, useState} from 'react';
import {stringToU8a} from '@polkadot/util';
import {xxhashAsHex} from '@polkadot/util-crypto';
import {useApi} from '../../hooks';

const MAX_EVENTS = 25;

const EventsContext = React.createContext([]);

function Events({children}) {
  const {api} = useApi();
  const [state, setState] = useState([]);

  useEffect((): void => {
    let subscriber;
    api.isReady.then(
      (): void => {
        const prevEventHash = '';
        let events = [];

        subscriber = api.query.system.events(
          (records): void => {
            const newEvents = records
              .filter(({event}): boolean => event.section !== 'system')
              .map((record, index) => ({
                key: `${Date.now()}-${index}`,
                record,
              }));
            const newEventHash = xxhashAsHex(
              stringToU8a(JSON.stringify(newEvents)),
            );

            if (newEventHash !== prevEventHash) {
              events = [...newEvents, ...events].slice(0, MAX_EVENTS);
              setState(events);
            }
          },
        );
      },
    );
    return () => {
      if (subscriber) {
        subscriber.then(unsub => unsub());
      }
    };
  }, [api]);

  return (
    <EventsContext.Provider value={state}>{children}</EventsContext.Provider>
  );
}

export {EventsContext, Events};
