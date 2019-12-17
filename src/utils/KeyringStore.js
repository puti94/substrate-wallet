/**
 * User: puti.
 * Time: 2019-12-12 09:54.
 */

export default {
  all: async cb => {
    await localStorage.init();
    localStorage.dataMap.forEach((v, k) => {
      try {
        cb(k, JSON.parse(v));
      } catch (e) {}
    });
  },
  get: (key, cb) => {
    try {
      cb && cb(JSON.parse(localStorage.getItem(key)));
    } catch (e) {
      cb && cb();
    }
  },
  remove: (key, cb) => {
    localStorage.removeItem(key);
    console.log('remove', key);
    cb && cb();
  },
  set: (key, value, cb) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
    cb && cb();
  },
};
