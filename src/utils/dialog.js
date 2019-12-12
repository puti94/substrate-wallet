/**
 * User: puti.
 * Time: 2019-11-07 15:44.
 */
import React from 'react';
import {Overlay} from 'teaset';
import {LoadingView} from '../components/DialogViews/LoadingView';
import {AlertView} from '../components/DialogViews/AlertView';

//保存通知组件的引用
let noticeRef;

export function setNoticeRef(ref) {
  noticeRef = ref;
}

export function alertWithType(
  type: 'info' | 'warn' | 'error' | 'custom' | 'success',
  title: string,
  message: string,
  payload?: object,
  interval?: number,
) {
  // noticeRef && noticeRef.closeAction();
  noticeRef && noticeRef.alertWithType(type, title, message, payload, interval);
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
