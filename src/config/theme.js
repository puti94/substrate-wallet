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
  backgroundColor: '#f3f4f6',
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

export const baseStyles = StyleSheet.create({
  cardItem: {
    backgroundColor: 'white',
    padding: px2dp(30),
    marginTop: px2dp(10),
    borderRadius: px2dp(10),
  },
  paramsItem: {
    padding: px2dp(10),
    borderWidth: 1,
    borderColor: theme.borderColor,
    marginTop: px2dp(10),
    borderStyle: 'dotted',
    borderRadius: px2dp(10),
  },
});

Theme.set({
  tvBarBtnActiveTitleColor: theme.baseColor,
  sbBtnPaddingBottom: 8,
  sbBtnPaddingLeft: 8,
  sbBtnPaddingRight: 8,
  sbBtnTextFontSize: 15,
  sbBtnActiveTitleColor: theme.baseColor,
  sbBtnActiveTextFontSize: 15,
  sbIndicatorLineColor: theme.baseColor,
  sbIndicatorLineWidth: px2dp(6),
});
