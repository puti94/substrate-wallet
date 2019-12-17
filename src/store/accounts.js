/**
 * User: puti.
 * Time: 2019-12-11 11:09.
 */
import {action} from 'easy-peasy';
import keyring from '@polkadot/ui-keyring';
import {toHex} from '../utils/defaults';

function checkPsw(pair, password) {
  if (!pair) {
    return false;
  }
  try {
    if (!pair.isLocked) {
      pair.lock();
    }
    pair.decodePkcs8(password);
    return pair;
  } catch (e) {
    return false;
  }
}

export default {
  selectedAddress: '',
  selectedAccount: null,
  setSelectedAccount: action((state, address) => {
    if (!address) {
      state.selectedAddress = '';
      state.selectedAccount = null;
      return;
    }
    state.selectedAddress = toHex(address);
    state.selectedAccount = keyring.getPair(address);
  }),
};
