/**
 * User: puti.
 * Time: 2018/11/23 上午9:02.
 */

import React from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Text,
} from 'react-native';
import {theme} from '../config/theme';
import Icon from './Icon';

const CommonButton = (props: Props) => {
  const {
    onPress,
    type,
    style,
    activeOpacity,
    underlayColor,
    disabled,
    icon,
    iconSize = px2dp(40),
    titleStyle,
    title,
    iconStyle,
    tintColor = 'white',
    children,
  } = props;
  const Contain = type === 'highlight' ? TouchableHighlight : TouchableOpacity;
  const disabledStyle = disabled ? {backgroundColor: '#CCC'} : {};

  const _renderChildren = () => {
    if (children) {
      return children;
    }
    return (
      <View style={styles.container}>
        {!!icon && (
          <Icon
            style={iconStyle}
            icon={icon}
            size={iconSize}
            color={tintColor}
          />
        )}
        {!!title && (
          <Text
            style={[
              styles.btnText,
              {marginLeft: icon ? px2dp(20) : 0},
              titleStyle,
            ]}>
            {title}
          </Text>
        )}
      </View>
    );
  };
  return (
    <Contain
      activeOpacity={activeOpacity}
      disabled={disabled}
      underlayColor={underlayColor}
      style={[styles.btn, disabledStyle, style]}
      onPress={onPress}>
      {_renderChildren()}
    </Contain>
  );
};
type Props = {
  onPress: Function,
  type?: 'highlight' | 'opacity',
  title: string,
  titleStyle?: any,
  iconStyle?: any,
  disabled?: boolean,
  underlayColor?: string,
  icon?: string | number,
  iconSize?: number,
};

CommonButton.defaultProps = {
  type: 'highlight',
  underlayColor: '#6885F6',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btn: {
    width: '90%',
    height: px2dp(100),
    backgroundColor: theme.baseColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: px2dp(28),
    borderRadius: px2dp(20),
    alignSelf: 'center',
  },
  btnText: {color: 'white', fontSize: 15, fontWeight: '500'},
});

export default CommonButton;
