import {
  Platform,
  StatusBar,
  DeviceInfo,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {Theme} from 'teaset';
//设计宽度
const basePixelWidth = 750;
const {width} = Dimensions.get('window');
export const px2dp = px => {
  return (px * width) / basePixelWidth;
};

export const theme = {
  //主题颜色
  baseColor: '#3288bd',
  navigationColor: '#fdfdfd',
  line: '#EAEAEA',
  backgroundColor: '#f9f9f9',
  navigationTitle: '#343434',
  navigationIcon: '#343434',
  borderColor: '#E6E6E6',
  title: '#2A2A2A',
  content: '#7A7A7A',
  hint: '#dedede',
  //标签色
  primary: '#006DCC',
  //信息颜色
  info: '#49AFCD',
  //成功色
  success: '#5BB75B',
  //警告色
  warning: '#FAA732',
  //危险色
  danger: '#DA4F49',
  //链接颜色
  link: '#0088CC',
  //禁用颜色
  disabled: '#EFF3F8',

  isIPhoneX: DeviceInfo.isIPhoneX_deprecated,
  //最细线
  hairline: StyleSheet.hairlineWidth,

  get statusBarHeight() {
    if (theme.isIPhoneX) {
      return 44;
    }
    if (Platform.OS === 'android') {
      if (Platform.Version < 21) {
        return 0;
      }
      return StatusBar.currentHeight;
    }
    return 20;
  },
  get bottomHeight() {
    if (theme.isIPhoneX) {
      return 34;
    }
    return 0;
  },
};
Theme.set({
  tvBarBtnActiveTitleColor: theme.baseColor,
});
