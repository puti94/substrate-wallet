import {EXPLORER_API} from '../config';

const request = require('./request');

/**
 * 获取上链数据
 * @param address
 * @param chainName
 * @param page
 * @param number
 * @returns {Promise<AxiosResponse<any> | never>}
 */
export function getExtrinsic({address, chainName, page = 25, number = 1}) {
  console.log('参数', arguments[0], chainName);
  return request({
    url: `${EXPLORER_API}${chainName}/api/v1/extrinsic`,
    params: {
      'filter[address]': address,
      'page[size]': page,
      'page[number]': number,
    },
  });
}

/**
 * 获取转账数据
 * @param address
 * @param chainName
 * @param page
 * @param number
 * @returns {Promise<AxiosResponse<any> | never>}
 */
export function getTransfer({address, chainName, page = 25, number = 1}) {
  return request({
    url: `${EXPLORER_API}${chainName}/api/v1/balances/transfer`,
    params: {
      'filter[address]': address,
      'page[size]': page,
      'page[number]': number,
    },
  });
}
