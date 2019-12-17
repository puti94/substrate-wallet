import React from 'react';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import {theme} from '../config/theme';

const LoadingView = ({title = i18n('Base.Loading')}) => {
  return (
    <View style={style.container}>
      <ActivityIndicator size={px2dp(80)} color={theme.baseColor} />
      <Text
        style={{
          fontSize: 14,
          color: theme.title,
          marginTop: px2dp(44),
        }}>
        {title}
      </Text>
    </View>
  );
};
export default LoadingView;

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
