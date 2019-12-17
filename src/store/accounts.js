/**
 * User: puti.
 * Time: 2019-12-11 11:09.
 */
import {action, thunk} from 'easy-peasy';
import keyring from '@polkadot/ui-keyring';
import {toHex} from '../utils/defaults';
import {alertWithType, showAlert, showTextInput} from '../utils/dialog';
import {api} from '../react-api';
import {isFunction} from '@polkadot/util';

export default {
  queue: [],
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
  send: thunk(async (actions, params, helpers) => {
    const {
      section,
      method,
      args,
      txUpdateCb,
      txFailedCb,
      txSuccessCb,
      txStartCb,
    } = params;
    let state = helpers.getState();
    if (!state.selectedAccount) {
      return false;
    }
    const pair = keyring.getPair(state.selectedAccount.address);
    if (pair.isLocked) {
      const password = await showTextInput({
        title: '请输入密码',
        type: 'secure-text',
      });
      try {
        pair.decodePkcs8(password);
      } catch (error) {
        showAlert('密码错误');
        return false;
      }
    }
    try {
      let tx = api.tx[section][method];
      let methods = `${section}.${method}`;
      let extrinsic = tx(...args);
      const unsubscribe = await extrinsic.signAndSend(pair, result => {
        if (!result || !result.status) {
          return;
        }

        if (isFunction(txUpdateCb)) {
          txUpdateCb(result);
        }

        if (result.status.isFinalized) {
          unsubscribe();

          result.events
            .filter(({event: {section}}) => section === 'system')
            .forEach(({event: {method}}) => {
              if (method === 'ExtrinsicFailed') {
                alertWithType('error', methods, 'ApplyExtrinsic');
                isFunction(txFailedCb) && txFailedCb(result);
              } else if (method === 'ExtrinsicSuccess') {
                alertWithType('success', methods, 'Finalized');
                isFunction(txSuccessCb) && txSuccessCb(result);
              }
            });
        } else if (result.isError) {
          alertWithType('error', methods, 'ApplyExtrinsic');
          isFunction(txFailedCb) && txFailedCb(result);
        }
      });
      pair.lock();
      txStartCb && txStartCb();
    } catch (e) {
      console.error('交易错误', e);
      return false;
    }
  }),
  pushQueue: action((state, params) => {
    state.queue = params;
  }),
};
