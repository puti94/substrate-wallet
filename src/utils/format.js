/**
 * User: puti.
 * Time: 2019-12-11 19:25.
 */
import {formatBalance as _formatBalance} from '@polkadot/util';
import BN from 'bn.js';

export function formatBalance(value = 0): string {
  let {unit, decimals} = _formatBalance.getDefaults();
  if (typeof value === 'undefined') {
    return `--- ${unit}`;
  }
  decimals = parseInt(decimals);
  let s = new BN(`${value}`).toString().padStart(decimals + 1, '0');
  const b = s.substr(0, s.length - decimals);
  const a = s.substr(s.length - decimals, 3);
  return `${b}.${a} ${unit}`;
}
