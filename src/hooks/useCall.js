// Copyright 2017-2019 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {useState, useEffect} from 'react';
import {isNull, isUndefined} from '@polkadot/util';

function extractParams(fn, params, paramMap) {
  return [
    JSON.stringify({f: fn.name, p: params}),
    params.length === 0 ||
    !params.some(param => isNull(param) || isUndefined(null))
      ? paramMap(params)
      : null,
  ];
}

export default function useCall(
  fn,
  params = [],
  {defaultValue, isSingle, transform = v => v, paramMap = v => v} = {},
) {
  const [value, setValue] = useState(defaultValue);
  const tracker = {
    isActive: false,
    count: 0,
    serialized: null,
    subscriber: null,
  };
  useEffect(() => {
    if (fn) {
      const [serialized, mappedParams] = extractParams(fn, params, paramMap);

      if (mappedParams && serialized !== tracker.serialized) {
        tracker.serialized = serialized;
        const validParams = params.filter(p => !isUndefined(p));
        tracker.isActive = true;
        tracker.count = 0;
        tracker.subscriber =
          fn &&
          (!fn.meta || !fn.meta.type.isDoubleMap || validParams.length === 2)
            ? fn(...params, v => {
                if (tracker.isActive && (!isSingle || !tracker.count)) {
                  tracker.count++;
                  setValue(transform(v));
                }
              })
            : null;
      }
    }
    return () => {
      if (tracker.subscriber) {
        tracker.subscriber.then(unsubFn => unsubFn());
        tracker.subscriber = null;
      }
    };
    // eslint-disable-next-line
  }, [fn, params]);
  return value;
}
