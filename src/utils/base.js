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
          let [prefix, address, genesisHash, assetId] = data.split(':');
          if (prefix !== ADDRESS_PREFIX) {
            throw new Error();
          }
          address = encodeAddress(decodeAddress(address));
          resolve({address, genesisHash, assetId});
        } catch (error) {
          showAlert('二维码格式错误');
          reject();
        }
      },
    });
  });
}

export async function checkNodeConnect(node) {
  return new Promise(async (resolve, reject) => {
    setTimeout(reject, 15000);
    const api = await ApiPromise.create({provider: new WsProvider(node)});
    await api.isReady;
    resolve();
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
