/**
 * User: puti.
 * Time: 2019-12-12 09:54.
 */

export default {
  all: async cb => {
    await localStorage.init();
    localStorage.dataMap.forEach((v, k) => {
      try {
        console.log('all', k, JSON.parse(v));
        cb(k, JSON.parse(v));
      } catch (e) {}
    });
  },
  get: (key, cb) => {
    console.log('get', key);
    try {
      cb(JSON.parse(localStorage.getItem(key)));
    } catch (e) {
      cb();
    }
  },
  remove: (key, cb) => {
    localStorage.removeItem(key);
    console.log('remove', key);
    cb();
  },
  set: (key, value, cb) => {
    console.log('set', key, value);
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
    cb && cb();
  },
};
