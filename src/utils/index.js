/**
 * User: puti.
 * Time: 2019-11-07 19:36.
 */
import {captureRef} from 'react-native-view-shot';
import Share from 'react-native-share';

export * from './with';
export * from './verify';

export function captureRefandShare(view) {
  return captureRef(view, {
    format: 'png',
    quality: 1,
    result: Platform.OS === 'ios' ? 'tmpfile' : 'data-uri',
  }).then(uri => {
    return Share.open({url: uri});
  });
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * @description 洗牌函数|Shuffle function
 * @param {Array} arr 要重组的数组|Array to be reorganized
 */
export function shuffle(arr) {
  let _arr = arr.slice();
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i);
    let t = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = t;
  }
  return _arr;
}

export function fixMnemonic(v = '') {
  console.log('fixMne', v);
  return v
    .trim()
    .split(' ')
    .filter(t => !!t)
    .map(t => t.toLowerCase())
    .join(' ');
}
