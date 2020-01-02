// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {useEffect, useRef, useState} from 'react';
import {isNull, isUndefined} from '@polkadot/util';

import useIsMountedRef from './useIsMountedRef';

// the default transform, just returns what we have
function transformIdentity(value: any): any {
  return value;
}

// extract the serialized and mapped params, all ready for use in our call
function extractParams(fn, params, paramMap) {
  return [
    JSON.stringify({f: fn?.name, p: params}),
    params.length === 0 ||
    !params.some((param): boolean => isNull(param) || isUndefined(null))
      ? paramMap(params)
      : null,
  ];
}

// unsubscribe and remove from  the tracker
function unsubscribe(tracker): void {
  tracker.current.isActive = false;

  if (tracker.current.subscriber) {
    tracker.current.subscriber.then((unsubFn): void => unsubFn());
    tracker.current.subscriber = null;
  }
}

// subscribe, tyring to play nice with the browser threads
function subscribe(
  mounted,
  tracker,
  fn,
  params,
  setValue,
  {isSingle, transform = transformIdentity},
) {
  const validParams = params.filter((p): boolean => !isUndefined(p));

  unsubscribe(tracker);

  setTimeout((): void => {
    if (mounted.current) {
      if (
        fn &&
        (!fn.meta || !fn.meta.type?.isDoubleMap || validParams.length === 2)
      ) {
        // swap to acive mode and reset our count
        tracker.current.isActive = true;
        tracker.current.count = 0;

        tracker.current.subscriber = fn(
          ...params,
          (value: any): void => {
            // when we don't have an active sub, or single-shot, ignore (we use the isActive flag here
            // since .subscriber may not be set on immeditae callback)
            if (
              mounted.current &&
              tracker.current.isActive &&
              (!isSingle || !tracker.current.count)
            ) {
              tracker.current.count++;
              setValue(transform(value));
            }
          },
        );
      } else {
        tracker.current.subscriber = null;
      }
    }
  }, 0);
}

// tracks a stream, typically an api.* call (derive, rpc, query) that
//  - returns a promise with an unsubscribe function
//  - has a callback to set the value
// FIXME The typings here need some serious TLC
export default function useCall(fn, params = [], options = {}) {
  const mounted = useIsMountedRef();
  const tracker = useRef({
    isActive: false,
    count: 0,
    serialized: null,
    subscriber: null,
  });
  const [value, setValue] = useState(options.defaultValue);

  // initial effect, we need an unsubscription
  useEffect((): (() => void) => {
    return (): void => {
      unsubscribe(tracker);
    };
  }, []);

  // on changes, re-subscribe
  useEffect((): void => {
    // check if we have a function & that we are mounted
    if (mounted.current && fn) {
      const [serialized, mappedParams] = extractParams(
        fn,
        params,
        options.paramMap || transformIdentity,
      );

      if (mappedParams && serialized !== tracker.current.serialized) {
        tracker.current.serialized = serialized;

        subscribe(mounted, tracker, fn, mappedParams, setValue, options);
      }
    }
  }, [fn, mounted, options, params]);

  return value;
}
