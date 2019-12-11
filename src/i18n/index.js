/**
 * User: puti.
 * Time: 2019-12-11 16:45.
 */
import {I18nManager} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import * as CONS from '../config';

const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: require('./translations/en').default,
  zh: require('./translations/zh').default,
};

// export const translate = memoize(
//   (key, config) => i18n.t(key, config),
//   (key, config) => (config ? key + JSON.stringify(config) : key),
// );
export const translate = (key, config) => i18n.t(key, config);
export const LANGS = [
  {lang: 'zh', label: '简体中文'},
  {lang: 'en', label: 'English'},
];
const initI18nConfig = () => {
  // fallback if no available language fits
  const fallback = {languageTag: 'en', isRTL: false};

  const {languageTag, isRTL} =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  // clear translation cache
  // translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);

  // set i18n-js config
  i18n.translations = {[languageTag]: translationGetters[languageTag]};
  i18n.locale = languageTag;
  i18n.fallbacks = true;
  i18n.locales.no = ['zh'];
  i18n.missingTranslationPrefix = 'EE: ';
  return languageTag;
};
export const DEFAULT_LANG = initI18nConfig();
export const setI18nConfig = (languageTag = DEFAULT_LANG) => {
  // translate.cache.clear();
  i18n.locale = languageTag;
  i18n.translations = {[languageTag]: translationGetters[languageTag]};
  localStorage.setItem(CONS.STORE_SETTING_LANG, languageTag);
};
