/**
 * User: puti.
 * Time: 2019-12-09 18:35.
 */
import {useContext} from 'react';
import {ApiContext} from '../react-api';
import {hasApis} from '../utils/base';

export {default as useCall} from './useCall';
export {default as useAccounts} from './useAccounts';
export {default as useSelectedAccount} from './useSelectedAccount';
export {default as useSendTx} from './useSendTx';

export function useApi() {
  return useContext(ApiContext);
}

export function useFoundApis(needApis) {
  const {api, isApiReady} = useApi();
  if (!isApiReady) {
    return false;
  }
  return hasApis(api, needApis);
}
