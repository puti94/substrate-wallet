/**
 * User: puti.
 * Time: 2019-12-11 19:25.
 */
import {formatBalance as _formatBalance} from '@polkadot/util';
import BN from 'bn.js';

export function formatBalance(value = 0, showUnit = true): string {
  let {unit, decimals} = _formatBalance.getDefaults();
  if (typeof value === 'undefined') {
    return `--- ${unit}`;
  }
  decimals = parseInt(decimals);
  let s = new BN(`${value}`).toString().padStart(decimals + 1, '0');
  const b = s.substr(0, s.length - decimals);
  const a = s.substr(s.length - decimals, 3);
  if (!showUnit) {
    return `${b}.${a}`;
  }
  return `${b}.${a} ${unit}`;
}

export function toBN(number): BN {
  if (!number) {
    return new BN(0);
  }
  const {decimals} = _formatBalance.getDefaults();
  let [a, b = '0'] = `${number}`.split('.');
  let s1 = `${a}${b.padEnd(decimals, '0')}`;
  return new BN(s1);
}
