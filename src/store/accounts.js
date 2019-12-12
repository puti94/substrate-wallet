/**
 * User: puti.
 * Time: 2019-12-11 11:09.
 */
import {action, thunk, computed} from 'easy-peasy';
import {cryptoWaitReady} from '@polkadot/util-crypto';
import {Keyring} from '@polkadot/api';
import SInfo from 'react-native-sensitive-info';
import {toHex} from '../utils/defaults';

const ACCOUNT_OPTIONS = {
  sharedPreferencesName: 'SubstrateWalletAccount',
  keychainService: 'SubstrateWalletAccountKey',
};

let keyring;

async function initKeyring() {
  await cryptoWaitReady();
  console.log('cryptoWaitReady');
  keyring = new Keyring({type: 'sr25519'});
}

function addTimestamp(pair) {
  if (!pair.meta.whenCreated) {
    pair.setMeta({whenCreated: Date.now()});
  }
}

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
  accounts: {},
  selectedAddress: '',
  selectedAccount: computed(state => {
    if (state.list.length === 0) {
      return null;
    } else if (!state.selectedAddress) {
      return state.list[0];
    } else {
      return state.accounts[state.selectedAddress];
    }
  }),
  list: computed(state =>
    Object.values(state.accounts).sort(
      (a, b) => a.meta.whenCreated - b.meta.whenCreated,
    ),
  ),
  addUri: thunk(async (actions, {suri, password}) => {
    const pair = await new Promise(resolve => {
      setTimeout(() => {
        //
        resolve(keyring.addFromUri(suri));
      }, 300);
    });
    actions.saveAccount({pair, password});
  }),
  addFromJson: thunk((actions, {json, password}) => {
    const pair = keyring.addFromJson(json);
    if (!checkPsw(pair, password)) {
      return Promise.reject('密码错误');
    } else {
      actions.saveAccount(pair, password);
      return true;
    }
  }),
  loadAll: thunk(async actions => {
    await initKeyring();
    const result = await SInfo.getAllItems(ACCOUNT_OPTIONS);
    console.log('res', result);
    if (!result || JSON.stringify(result).length < 10) {
      return;
    }
    if (Platform.OS === 'ios') {
      result.forEach(item => {
        item.forEach(t => {
          const pair = keyring.addFromJson(JSON.parse(t.value));
          actions.addAccount(pair);
        });
      });
    } else {
      for (let o in result) {
        const pair = keyring.addFromJson(JSON.parse(result[o]));
        actions.addAccount(pair);
      }
    }
  }),
  saveAccount: action((state, {pair, password}) => {
    addTimestamp(pair);
    const json = pair.toJson(password);
    const publicKey = toHex(json.address);
    SInfo.setItem(publicKey, JSON.stringify(json), ACCOUNT_OPTIONS);
    state.accounts[publicKey] = keyring.addFromJson(json);
  }),
  addAccount: action((state, pair) => {
    state.accounts = {...state.accounts, [toHex(pair.address)]: pair};
  }),
};
