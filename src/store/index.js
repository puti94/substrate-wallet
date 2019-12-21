/**
 * User: puti.
 * Time: 2019-12-11 11:05.
 */
import {createStore} from 'easy-peasy';
import accounts from './accounts';
import set from './set';
export const store = createStore({
  accounts,
  set,
});
