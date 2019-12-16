/**
 * User: puti.
 * Time: 2019-12-13 14:17.
 */
import Input from './Input';
import {TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from '../../Icon';

export default class Password extends Input {
  state = {
    secureTextEntry: true,
  };

  buildProps(props) {
    return {
      secureTextEntry: this.state.secureTextEntry,
      ...props,
    };
  }

  renderRight(): null {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={{padding: px2dp(10)}}
        onPress={() =>
          this.setState({secureTextEntry: !this.state.secureTextEntry})
        }>
        <Icon
          icon={this.state.secureTextEntry ? 'Feather/eye' : 'Feather/eye-off'}
          size={px2dp(40)}
        />
      </TouchableOpacity>
    );
  }
}
