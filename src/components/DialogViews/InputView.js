/**
 * User: puti.
 * Time: 2018/12/6 1:47 PM.
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Overlay} from 'teaset';
import {px2dp, theme} from '../../config/theme';
import Input from '../Forms/Inputs/Input';
import Password from '../Forms/Inputs/Password';

const {width, height} = Dimensions.get('window');

export class InputView extends Component<{
  onSurePress: Function,
  onRestorePress: Function,
  title?: String,
  message?: String,
  type?: String,
}> {
  state = {
    text: '',
  };

  render() {
    const {onSurePress, onRestorePress, title, type} = this.props;
    let InputView;
    if (type === 'secure-text') {
      InputView = Password;
    } else {
      InputView = Input;
    }
    return (
      <Overlay.PopView
        containerStyle={styles.container}
        overlayOpacity={0.8}
        modal={true}>
        <View
          style={{
            backgroundColor: 'white',
            width: px2dp(540),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: px2dp(20),
            paddingTop: px2dp(30),
            paddingHorizontal: px2dp(30),
          }}>
          <Text
            style={{
              lineHeight: px2dp(40),
              fontSize: fontSize(30),
              marginBottom: px2dp(35),
              color: '#35384B',
              textAlign: 'center',
            }}>
            {title}
          </Text>
          <View
            style={{
              backgroundColor: '#eee',
              height: px2dp(80),
              borderBottomWidth: 0,
              marginHorizontal: px2dp(0),
            }}>
            <InputView
              style={{color: '#35384B', flex: 1}}
              autoFocus
              onChangeText={text => this.setState({text: text})}
              value={this.state.text}
              placeholder={''}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              marginBottom: px2dp(26),
            }}>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={onRestorePress}>
              <Text style={{fontSize: fontSize(30), color: 'white'}}>
                {i18n('Base.Cancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => {
                onSurePress(this.state.text);
              }}>
              <Text style={{fontSize: fontSize(30), color: '#35384B'}}>
                {i18n('Base.Confirm')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Overlay.PopView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContainer: {
    width: px2dp(220),
    borderRadius: px2dp(20),
    backgroundColor: theme.baseColor,
    height: px2dp(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
