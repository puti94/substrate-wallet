/**
 * User: puti.
 * Time: 2019-12-13 11:01.
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {theme} from '../../config/theme';
import Input from './Inputs/Input';
import Select, {Props as SelectedProps} from './Inputs/Select';
import Button, {Props as ButtonProps} from './Inputs/Button';
import Number from './Inputs/Number';
import Area from './Inputs/Area';
import Icon from '../Icon';
import Password from './Inputs/Password';
import {
  TYPE_AREA,
  TYPE_BUTTON,
  TYPE_NUMBER,
  TYPE_PASSWORD,
  TYPE_SELECT,
} from './types';

export type FieldProps = {
  prop: string,
  label?: string,
  placeholder?: string,
  inputStyle?: Object | number,
  validate?: Array<{
    verify: (any, Object) => boolean | Promise<boolean>,
    message: string,
  }>,
  required?: boolean,
  requestFocus?: boolean,
  requiredMessage: string,
  rightIcon?: string,
  rightPress?: Function,
  type?: string,
  hint?: string | any,
} & SelectedProps &
  ButtonProps;

const mapTypeToComponent = type => {
  switch (type) {
    case TYPE_BUTTON:
      return Button;
    case TYPE_SELECT:
      return Select;
    case TYPE_NUMBER:
      return Number;
    case TYPE_PASSWORD:
      return Password;
    case TYPE_AREA:
      return Area;
    default:
      return Input;
  }
};

export default class FormItem extends Component<FieldProps> {
  state = {
    isFocus: false,
  };

  focus = () => {
    this.input.focus && this.input.focus();
  };

  render() {
    const {
      label,
      prop,
      onBlur,
      onFocus,
      style,
      type,
      hint,
      error,
      rightIcon,
      handleChange,
      rightPress,
      inputStyle,
      ...otherProps
    } = this.props;
    const InputComponent = mapTypeToComponent(type);
    return (
      <TouchableOpacity
        onPress={() => {
          this.input.click && this.input.click();
        }}
        activeOpacity={1}>
        <View
          style={[
            styles.container,
            {
              borderColor: error
                ? theme.danger
                : this.state.isFocus
                ? theme.baseColor
                : '#999',
            },
            style,
          ]}>
          <View style={styles.topContainer}>
            <Text style={styles.title}>{label}</Text>
            {!!hint && (
              <Text style={styles.hint}>
                {typeof hint === 'function' ? hint(this.props) : hint}
              </Text>
            )}
          </View>
          <View style={styles.content}>
            <InputComponent
              ref={input => (this.input = input)}
              onChangeText={handleChange}
              label={label}
              {...otherProps}
              stype={inputStyle}
              onBlur={() => {
                this.setState({isFocus: false});
                try {
                  onBlur && onBlur(prop);
                } catch (e) {}
              }}
              onFocus={() => {
                this.setState({isFocus: true});
                onFocus && onFocus(prop);
              }}
            />
            {!!rightIcon && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  rightPress && rightPress(handleChange);
                }}>
                <Icon icon={rightIcon} size={px2dp(40)} />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              height: error ? px2dp(40) : 0,
            }}>
            {!!error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: px2dp(30),
    backgroundColor: 'white',
    marginTop: px2dp(20),
    borderRadius: px2dp(10),
    borderWidth: theme.hairline,
    minHeight: px2dp(140),
    paddingHorizontal: px2dp(20),
    paddingVertical: px2dp(10),
  },
  topContainer: {
    flexDirection: 'row',
    height: px2dp(40),
    alignItems: 'center',
  },
  title: {
    color: theme.title,
    fontSize: 12,
    flex: 1,
  },
  hint: {
    color: theme.content,
    fontSize: 12,
  },
  content: {
    flexDirection: 'row',
    minHeight: px2dp(60),
    maxHeight: px2dp(360),
    flex: 1,
  },
  errorText: {color: theme.danger, fontSize: 12},
});
