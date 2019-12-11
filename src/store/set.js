/**
 * User: puti.
 * Time: 2019-12-11 11:09.
 */
import {action, thunk} from 'easy-peasy';

export default {
  lang: 'en',
  addPair: action((state, lang) => {
    state.lang = lang;
  }),
};
