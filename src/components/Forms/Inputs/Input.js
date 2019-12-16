/**
 * User: puti.
 * Time: 2019-12-13 14:17.
 */
import React, {Component} from 'react';
import {TextInput, View, StyleSheet} from 'react-native';
import {theme} from '../../../config/theme';

export default class Input extends Component {
  focus() {
    this.input && this.input.focus();
  }

  click() {
    this.focus();
  }

  buildProps(props) {
    return props;
  }

  renderRight() {
    return null;
  }

  render() {
    const {style, placeholder, label, ...props} = this.props;
    const buildProps = this.buildProps(props);
    return (
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            maxHeight: px2dp(400),
          },
          style,
        ]}>
        <TextInput
          ref={f => (this.input = f)}
          placeholder={placeholder || `请输入${label}`}
          placeholderTextColor={theme.hint}
          {...buildProps}
          style={[styles.input, style]}
          underlineColorAndroid={'transparent'}
        />
        {this.renderRight()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  input: {padding: 0, fontSize: 16, flex: 1},
});
