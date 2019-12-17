// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {useStoreState} from 'easy-peasy';

export default function useSelectedAccount(): {
  address: string,
  meta: {name: string},
} | null {
  return useStoreState(state => state.accounts.selectedAccount);
}
