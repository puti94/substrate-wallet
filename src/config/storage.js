/**
 * User: puti.
 * Time: 2019-12-11 15:25.
 */
import AsyncStorage from '@react-native-community/async-storage';

class Storage {
  constructor() {
    this.dataMap = new Map();
    this.loaded = false;
  }

  init = async () => {
    if (this.loaded) {
      return;
    }
    const keys = await AsyncStorage.getAllKeys();
    const data = await AsyncStorage.multiGet(keys);
    data.forEach(this.saveItem.bind(this));
    this.loaded = true;
    return [...data];
  };

  getItem = key => {
    return this.dataMap.get(key);
  };

  setItem = (key, value) => {
    this.dataMap.set(key, value);
    return AsyncStorage.setItem(key, value);
  };

  remove = key => {
    this.dataMap.delete(key);
    return AsyncStorage.removeItem(key);
  };

  saveItem = item => {
    this.dataMap.set(item[0], item[1]);
  };
}

global.localStorage = new Storage();
