import React, {PureComponent} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {px2dp, theme} from '../config/theme';
import {Menu} from 'teaset';
import {RouteHelper} from 'react-navigation-easy-helper';
import Icon from './Icon';

export type Props = {
  title?: string,
  hideLeft?: boolean,
  leftPress?: Function,
  leftTitle?: string,
  leftView?: any,
  leftIcon?: any,
  hideRight?: boolean,
  rightPress?: Function,
  rightView?: any,
  rightIcon?: any,
  titleStyle?: any,
  rightTitle?: string,
  hasShadow?: boolean,
  rightMenus?: Array,
  centerView?: any,
  navStyle?: any,
  rightMenu?: Array,
  leftIconSize?: number,
  rightIconSize?: number,
};

export default class NavBar extends PureComponent<Props> {
  static defaultProps = {
    title: '',
    hideLeft: false,
    leftIcon: 'left',
    hasShadow: false,
    leftIconSize: px2dp(40),
    rightIconSize: px2dp(40),
  };

  render() {
    const {
      hideLeft,
      leftPress,
      leftIcon,
      leftView,
      leftTitle,
      title,
      hideRight,
      rightPress,
      rightIcon,
      rightView,
      rightTitle,
      centerView,
      rightMenu,
      navStyle,
      leftIconSize,
      rightIconSize,
      titleStyle,
    } = this.props;

    let leftViewPress = null;
    if (typeof leftPress === 'undefined') {
      leftViewPress = () => {
        RouteHelper.goBack();
      };
    } else {
      leftViewPress = leftPress;
    }

    const leftProps = {
      view: leftView,
      hide: hideLeft,
      icon: leftIcon,
      title: leftTitle,
      iconSize: leftIconSize,
      onPress: leftViewPress,
    };
    const rightProps = {
      view: rightView,
      menu: rightMenu,
      hide: hideRight,
      icon: rightIcon,
      title: rightTitle,
      onPress: rightPress,
      iconSize: rightIconSize,
      style: {
        justifyContent: 'flex-end',
      },
    };
    return (
      <View style={[styles.contain, navStyle]}>
        <View style={styles.subContain}>
          <BothSideView {...leftProps} isBack />
          {centerView ? (
            centerView
          ) : (
            <View style={styles.centerContain}>
              <Text
                style={[styles.titleText, titleStyle]}
                numberOfLines={1}>
                {title}
              </Text>
            </View>
          )}
          <BothSideView {...rightProps} />
        </View>
      </View>
    );
  }
}

const BothSideView = ({
  hide,
  onPress,
  icon,
  view,
  title,
  style,
  menu,
  iconSize,
}) => {
  let subView, ins;
  if (view) {
    subView = view;
  } else if (!icon && menu && menu.length !== 0) {
    subView = menu.map((item, index) => (
      <TouchableOpacity
        key={index}
        style={{marginLeft: 17, paddingRight: px2dp(7)}}
        onPress={item.onPress}>
        {item.title ? (
          <Text style={styles.buttonText} numberOfLines={1}>
            {item.title}
          </Text>
        ) : (
          <Icon
            icon={item.icon}
            size={iconSize}
            color={theme.navigationIcon}
            resizeMode={'contain'}
          />
        )}
      </TouchableOpacity>
    ));
  } else if (!hide) {
    subView = (
      <TouchableOpacity
        ref={t => (ins = t)}
        onPress={() => {
          if (onPress) {
            onPress();
          } else if (menu && menu.length !== 0) {
            const items = menu.map(t => ({
              ...t,
              icon: (
                <Icon
                  style={{marginRight: px2dp(10)}}
                  icon={t.icon}
                  size={px2dp(28)}
                  color={theme.navigationIcon}
                />
              ),
            }));
            ins.measureInWindow((x, y, width, height) => {
              Menu.show({x, y, width, height}, items, {
                showArrow: true,
                align: 'end',
              });
            });
          }
        }}
        style={styles.itemStyle}>
        {title ? (
          <Text style={styles.buttonText} numberOfLines={1}>
            {title}
          </Text>
        ) : (
          <Icon
            icon={icon}
            size={iconSize}
            color={theme.navigationIcon}
            resizeMode={'contain'}
          />
        )}
      </TouchableOpacity>
    );
  }
  return <View style={[styles.bothSidesContain, style]}>{subView}</View>;
};
const styles = StyleSheet.create({
  contain: {
    paddingTop: theme.statusBarHeight,
    height: 44 + theme.statusBarHeight,
    backgroundColor: theme.navigationColor,
    width: '100%',
    paddingHorizontal: 15,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  subContain: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bothSidesContain: {
    flex: 1.5,
    flexDirection: 'row',
  },
  centerContain: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: theme.navigationTitle,
    fontSize: 18,
  },
  buttonText: {
    color: theme.navigationTitle,
    fontSize: 16,
  },
  itemStyle: {
    minWidth: 32,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: px2dp(7),
  },
});
