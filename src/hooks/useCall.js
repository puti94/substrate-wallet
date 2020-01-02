// Copyright 2017-2019 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {useState, useEffect, useRef} from 'react';
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
  const tracker = useRef({
    isActive: false,
    count: 0,
    serialized: null,
    subscriber: null,
  });
  useEffect(() => {
    if (fn) {
      const [serialized, mappedParams] = extractParams(fn, params, paramMap);

      if (mappedParams && serialized !== tracker.current.serialized) {
        tracker.current.serialized = serialized;
        const validParams = params.filter(p => !isUndefined(p));
        tracker.current.isActive = true;
        tracker.current.count = 0;
        tracker.current.subscriber =
          fn &&
          (!fn.meta || !fn.meta.type.isDoubleMap || validParams.length === 2)
            ? fn(...params, v => {
                if (
                  tracker.current.isActive &&
                  (!isSingle || !tracker.current.count)
                ) {
                  tracker.current.count++;
                  setValue(transform(v));
                }
              })
            : null;
      }
    }
    return () => {
      if (tracker.current && tracker.current.subscriber) {
        tracker.current.subscriber.then(unsubFn => unsubFn());
      }
    };
    // eslint-disable-next-line
  }, [fn,params]);
  return value;
}
