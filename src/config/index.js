/**
 * User: puti.
 * Time: 2019-12-11 17:11.
 */
import './storage';
import {px2dp, fontSize} from './theme';
import {translate} from '../i18n';
import {Platform, StatusBar, YellowBox} from 'react-native';
import {Menu, ActionPopover} from 'teaset';

if (Platform.OS === 'android') {
  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor('transparent');
}
export * from './constant';
global.px2dp = px2dp;
global.i18n = translate;
global.fontSize = fontSize;
YellowBox.ignoreWarnings([
  'Require cycles',
  'Remote debugger',
  'unknown call',
  'persist',
  "(evaluating '_e$target.name')",
]);
//修复安卓沉浸式状态栏Teaset的问题
if (Platform.OS === 'android') {
  const menuShow = Menu.show.bind(Menu);
  Menu.show = (fromBounds, items, options = {}) => {
    fromBounds.y += StatusBar.currentHeight;
    return menuShow(fromBounds, items, options);
  };
  const actionPopoverShow = ActionPopover.show.bind(ActionPopover);
  ActionPopover.show = (fromBounds, items, options = {}) => {
    fromBounds.y += StatusBar.currentHeight;
    return actionPopoverShow(fromBounds, items, options);
  };
}
