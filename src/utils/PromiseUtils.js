/**
 * @flow
 * User: puti.
 * Time: 2018/4/20 上午11:59.
 */

import {Platform, Alert} from 'react-native';
import Permissions, {PERMISSIONS, RESULTS} from 'react-native-permissions';

const PERMISSION = {
  camera: Platform.select({
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
  }),
  photo: Platform.select({
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  }),
};
/**
 * 检查权限
 * @param promise 权限
 * @returns {Promise<boolean|*>}
 */
export const checkPermission = async ({
  promise = 'camera',
}: {promise: string} = {}) => {
  try {
    const res = await Permissions.check(PERMISSION[promise]);
    console.log('check', res);
    return await decideAction(res, PERMISSION[promise]);
  } catch (e) {
    console.log('error', e);
    return Promise.reject(e);
  }
};

const decideAction = async (res: string, promise): Promise<boolean> => {
  switch (res) {
    case RESULTS.GRANTED:
      return true;
    case RESULTS.BLOCKED:
    case RESULTS.UNAVAILABLE:
      if (Platform.OS === 'ios') {
        await new Promise(resolve => {
          Alert.alert(i18n('Promise.Title'), i18n('Promise.Message'), [
            {
              text: i18n('Base.Open'),
              onPress: () => resolve(Permissions.openSettings()),
            },
            {text: i18n('Base.Cancel'), onPress: () => resolve(false)},
          ]);
        });
      }
      return false;
    case RESULTS.DENIED:
      const request = await Permissions.request(promise);
      console.log('request', request);
      return await decideAction(request, promise);
  }
  return false;
};
