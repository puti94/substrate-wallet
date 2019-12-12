// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {useEffect, useState} from 'react';
import addressObservable from '@polkadot/ui-keyring/observable/addresses';

type UseAccounts = {
  allAddresses: string[],
  hasAddresses: boolean,
};

export default function useAddresses(): UseAccounts {
  const [state, setState] = useState({allAddresses: [], hasAddresses: false});

  useEffect(() => {
    const subscription = addressObservable.subject.subscribe(
      (addresses): void => {
        const allAddresses = addresses ? Object.keys(addresses) : [];
        const hasAddresses = allAddresses.length !== 0;

        setState({allAddresses, hasAddresses});
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setState]);

  return state;
}
