/**
 * User: puti.
 * Time: 2019-11-07 15:44.
 */
import React from 'react';
import {Alert} from 'react-native';
import {Overlay} from 'teaset';
import {LoadingView} from '../components/DialogViews/LoadingView';
import {AlertView} from '../components/DialogViews/AlertView';
import {InputView} from '../components/DialogViews/InputView';

//保存通知组件的引用
let noticeRef;
let actionSheetRef;

export function setActionSheetRef(ref) {
  actionSheetRef = ref;
}

type ActionSheetParams = {
  title: string,
  message: string,
  cancelButtonIndex: number,
  options: Array<string>,
  destructiveButtonIndex: number,
  onPress: number => void,
};

export function showActionSheet(params: ActionSheetParams) {
  actionSheetRef && actionSheetRef.show(params);
}
export function setNoticeRef(ref) {
  noticeRef = ref;
}

export function alertWithType(
  type: 'info' | 'warn' | 'error' | 'custom' | 'success',
  title: string,
  message: string,
  payload?: Object,
  interval?: number,
) {
  // noticeRef && noticeRef.closeAction();
  noticeRef && noticeRef.alertWithType(type, title, message, payload, interval);
}

/**
 *
 * @param title
 * @param type secure-text | none
 * @returns {Promise<any> | Promise<*>}
 */
export function showTextInput({title = '请输入', type}) {
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        title,
        null,
        [
          {
            text: i18n('Base.Cancel'),
            onPress: reject,
            style: 'cancel',
          },
          {
            text: i18n('Base.Confirm'),
            onPress: resolve,
          },
        ],
        type,
      );
    } else {
      let key = Overlay.show(
        <InputView
          title={title}
          type={type}
          onSurePress={text => {
            resolve(text);
            Overlay.hide(key);
          }}
          onRestorePress={() => {
            Overlay.hide(key);
            reject();
          }}
        />,
      );
    }
  });
}

export function showLoading(message = i18n('Base.Loading'), modal = false) {
  const key = Overlay.show(<LoadingView message={message} modal={modal} />);
  return () => Overlay.hide(key);
}

export function showAlert(
  title,
  message,
  buttons = [{text: i18n('Base.Understood')}],
) {
  const key = Overlay.show(
    <AlertView
      title={title}
      message={message}
      buttons={buttons.map(t => ({
        ...t,
        onPress: () => {
          Overlay.hide(key);
          t.onPress && t.onPress();
        },
      }))}
    />,
  );
}
