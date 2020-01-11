/**
 * User: puti.
 * Time: 2019-12-16 21:36.
 */
import keyring from '@polkadot/ui-keyring';
import {decodeAddress} from '@polkadot/util-crypto';
import {fixMnemonic} from './index';

export function isPassValid(password) {
  return keyring.isPassValid(password);
}

export function isAddress(address) {
  if (!address) {
    return false;
  }
  try {
    decodeAddress(address || '');
    return true;
  } catch (e) {
    return false;
  }
}

export function isValueEmpty(value) {
  return typeof value === 'undefined' || value === null || value === '';
}

/**
 * 是否是助记词
 * @param value
 * @returns {boolean}
 */
export function isMnemonic(value) {
  let number = fixMnemonic(value).split(' ').length;
  return [12, 15, 18, 21, 24].includes(number);
}

/**
 * 判断是否是keystore文件内容
 * @param value
 * @returns {boolean}
 */
export function isKeystore(value) {
  try {
    return isAddress(JSON.parse(value).address);
  } catch (e) {
    return false;
  }
}
