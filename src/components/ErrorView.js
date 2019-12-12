import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {Button} from 'teaset';
import Icon from './Icon';
import {theme} from '../config/theme';

function ErrorView({btnStyle, textStyle, errorText, btnTitle, onPress}) {
  return (
    <View style={styles.container}>
      <View style={styles.errorContainer}>
        <Icon
          color={theme.danger}
          size={px2dp(120)}
          icon={'MaterialIcons/error'}
        />
        <Text style={[styles.textStyle, textStyle]}>{errorText}</Text>
        {!!btnTitle && (
          <Button
            onPress={onPress}
            style={[{marginTop: px2dp(117)}, btnStyle]}
            title={btnTitle}
          />
        )}
      </View>
    </View>
  );
}

export default ErrorView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btn_style: {
    marginTop: px2dp(117),
  },
  textStyle: {
    fontSize: 14,
    color: '#707070',
    textAlign: 'center',
    marginTop: px2dp(44),
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
