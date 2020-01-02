/**
 * User: puti.
 * Time: 2019-12-11 10:48.
 */
import {checkPermission} from './PromiseUtils';
import {RouteHelper} from 'react-navigation-easy-helper';
import {isFunction} from '@polkadot/util';
import {decodeAddress, encodeAddress} from '@polkadot/util-crypto';
import {WsProvider, ApiPromise} from '@polkadot/api';
import {showAlert} from './dialog';

const ADDRESS_PREFIX = 'substrate';

export async function showDecodeAddressQR(): Promise<{
  address: string,
  genesisHash: string,
  assetId?: string,
}> {
  await checkPermission();
  return new Promise((resolve, reject) => {
    RouteHelper.navigate('QRReading', {
      success: data => {
        try {
          let [prefix, address, genesisHash] = data.split(':');
          if (prefix !== ADDRESS_PREFIX) {
            throw new Error();
          }
          address = encodeAddress(decodeAddress(address));
          resolve({address, genesisHash});
        } catch (error) {
          showAlert('二维码格式错误');
          reject();
        }
      },
    });
  });
}

export async function checkNodeConnect(node, types) {
  console.log('checkNodeConnect', node, types);
  return new Promise((resolve, reject) => {
    setTimeout(() => reject({message: 'timeout'}), 15000);
    const api = new ApiPromise({
      provider: new WsProvider(node),
      types,
    });
    const readyHandler = () => {
      api.off('ready', readyHandler);
      api.off('error', errorHandler);
      resolve();
    };
    const errorHandler = e => {
      console.log('错误', e);
      api.off('ready', readyHandler);
      api.off('error', errorHandler);
      reject(e);
    };
    api.on('ready', readyHandler);
    api.on('error', errorHandler);
  });
}

function hasEndpoint(api, endpoint) {
  const [area, section, method] = endpoint.split('.');
  try {
    return isFunction(api[area][section][method]);
  } catch (error) {
    return false;
  }
}

export function hasApis(api, needsApi) {
  const notFound = needsApi.filter(endpoint => {
    return !hasEndpoint(api, endpoint);
  });
  return notFound.length === 0;
}
