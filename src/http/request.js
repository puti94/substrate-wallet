const axios = require('axios').default;
const request = axios.create({
  timeout: 15000,
});
request.defaults.headers.post['Content-Type'] = 'application/json';
request.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  },
);
request.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    console.error('错误', error); // for debug
    return Promise.reject(error);
  },
);
module.exports = request;
