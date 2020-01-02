/**
 * User: puti.
 * Time: 2019-12-11 11:09.
 */
import {action, computed} from 'easy-peasy';

const uuidv1 = require('uuid/v1');
import {
  STORE_ADDRESSBOOKS,
  STORE_SETTING_CUSTOM_ENDPOINTS,
  STORE_SETTING_LANG,
} from '../config';
import {DEFAULT_LANG, setI18nConfig} from '../i18n';

export default {
  lang: DEFAULT_LANG,
  addressBooks: {},
  customNodeList: [],
  initData: action(state => {
    state.lang = localStorage.getItem(STORE_SETTING_LANG) || DEFAULT_LANG;
    setI18nConfig(state.lang);
    const item = localStorage.getItem(STORE_ADDRESSBOOKS);
    const nodes = localStorage.getItem(STORE_SETTING_CUSTOM_ENDPOINTS);
    state.addressBooks = item ? JSON.parse(item) : {};
    state.customNodeList = nodes ? JSON.parse(nodes) : [];
    console.log('initset', state);
  }),
  addressBookList: computed(state => {
    return Object.keys(state.addressBooks).map(t => ({
      ...state.addressBooks[t],
      id: t,
    }));
  }),
  setLang: action((state, lang) => {
    state.lang = lang;
    localStorage.setItem(STORE_SETTING_LANG, lang);
  }),
  addBook: action((state, {address, name}) => {
    state.addressBooks = {...state.addressBooks, [uuidv1()]: {address, name}};
    localStorage.setItem(
      STORE_ADDRESSBOOKS,
      JSON.stringify(state.addressBooks),
    );
  }),
  editBook: action((state, {address, name, id}) => {
    state.addressBooks[id] = {address, name};
    state.addressBooks = {...state.addressBooks};
    localStorage.setItem(
      STORE_ADDRESSBOOKS,
      JSON.stringify(state.addressBooks),
    );
  }),
  removeBook: action((state, id) => {
    delete state.addressBooks[id];
    state.addressBooks = {...state.addressBooks};
    localStorage.setItem(
      STORE_ADDRESSBOOKS,
      JSON.stringify(state.addressBooks),
    );
  }),
  addNode: action((state, {node, types}) => {
    state.customNodeList = [...state.customNodeList, node];
    localStorage.setItem(
      STORE_SETTING_CUSTOM_ENDPOINTS,
      JSON.stringify(state.customNodeList),
    );
    localStorage.setItem(`${STORE_SETTING_CUSTOM_ENDPOINTS}_${node}`, types);
  }),
  removeNode: action((state, node) => {
    const index = state.customNodeList.findIndex(t => t === node);
    state.customNodeList.splice(index, 1);
    state.customNodeList = [...state.customNodeList];
    localStorage.setItem(
      STORE_SETTING_CUSTOM_ENDPOINTS,
      JSON.stringify(state.customNodeList),
    );
    localStorage.removeItem(`${STORE_SETTING_CUSTOM_ENDPOINTS}_${node}`);
  }),
};
