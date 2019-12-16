/**
 * User: puti.
 * Time: 2019-12-13 14:17.
 */
import React, {Component} from 'react';
import {Text, View, Keyboard} from 'react-native';
import {theme} from '../../../config/theme';
import Icon from '../../Icon';

export type Props = {
  placeholder?: string,
  placeholderTextColor?: string,
  onPress?: Function,
};
export default class Button<T> extends Component<T & Props> {
  focus() {
    console.log('focus');
    const {onFocus} = this.props;
    onFocus && onFocus();
    this.click();
  }

  async click() {
    const {onBlur, onSubmitEditing, onFocus} = this.props;
    onFocus && onFocus();
    await this.handleClick();
    onBlur && onBlur();
    onSubmitEditing && onSubmitEditing();
  }

  async handleClick() {
    Keyboard.dismiss();
    const {onChangeText, value, onPress} = this.props;
    return new Promise((resolve, reject) => {
      if (onPress) {
        onPress(value, text => {
          onChangeText(text);
          resolve();
        });
      } else {
        reject();
      }
    });
  }

  getShowValue(value) {
    return value;
  }

  render() {
    const {
      style,
      value,
      label,
      placeholderTextColor,
      onPress,
      ...props
    } = this.props;
    const placeholder = this.props.placeholder || `请选择${label}`;
    return (
      <View
        style={{
          flex: 1,
          height: px2dp(60),
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text
          style={[{flex: 1, lineHeight: px2dp(60), fontSize: 16}, style]}
          {...props}>
          {this.getShowValue(value) || (
            <Text style={{color: placeholderTextColor || theme.hint}}>
              {placeholder}
            </Text>
          )}
        </Text>
        <Icon icon={'right'} size={px2dp(30)} />
      </View>
    );
  }
}
