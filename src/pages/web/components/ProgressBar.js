/**
 * User: puti.
 * Time: 2019-12-16 11:06.
 */

import React, {Component} from 'react';
import {StyleSheet, View, Animated, NativeModules} from 'react-native';
import {theme} from '../../../config/theme';
const {UIManager} = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);
export default class ProgressBar extends Component {
  state = {
    width: new Animated.Value(0),
  };

  componentDidMount() {
    this._loopAnim();
  }

  _loopAnim = () => {
    Animated.timing(this.state.width, {
      toValue: px2dp(750),
    }).start(() => {
      this.state.width.setValue(0);
      this._loopAnim();
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Animated.View
          style={{
            width: this.state.width,
            height: '100%',
            backgroundColor: theme.baseColor,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: px2dp(4),
    opacity: 0.7,
    width: '100%',
    position: 'absolute',
    backgroundColor: '#fff',
  },
});
