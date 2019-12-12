/**
 * User: puti.
 * Time: 2018/12/6 1:47 PM.
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Overlay} from 'teaset';
import {px2dp, theme} from '../../config/theme';

const {width, height} = Dimensions.get('window');

export class AlertView extends Component {
  render() {
    const {title = '标题', message = '', buttons = []} = this.props;
    return (
      <Overlay.PopView
        animated={false}
        containerStyle={{
          width: width,
          height: height,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        overlayOpacity={0.7}
        modal={true}>
        <View style={styles.container}>
          <View style={{alignItems: 'center', width: '100%', flex: 1}}>
            {!!title && <Text style={styles.title}>{title}</Text>}
            {!!message && <Text style={styles.message}>{message}</Text>}
          </View>
          <View style={{flexDirection: 'row', height: px2dp(80)}}>
            {buttons.map(t => (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={t.onPress}
                style={{
                  flex: 1,
                  backgroundColor: theme.baseColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: '#35384B', fontSize: 15}}>{t.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Overlay.PopView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: px2dp(500),
    minHeight: px2dp(200),
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: px2dp(20),
    paddingTop: px2dp(50),
    overflow: 'hidden',
  },
  title: {
    color: '#35384B',
    fontSize: 15,
    marginBottom: px2dp(20),
  },
  message: {
    width: '90%',
    color: '#35384B',
    fontSize: 12,
    marginBottom: px2dp(20),
  },
  text: {color: '#a2a2a2', fontSize: 14, textAlign: 'center'},
});
