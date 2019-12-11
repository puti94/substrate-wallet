import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const LoadingView = () => {
  return (
    <View style={style.container}>
      <View style={style.loadingContainer}>
        <Text
          style={{
            fontSize: 14,
            color: '#707070',
            marginTop: px2dp(44),
          }}>
          {i18n('Base.Loading')}
        </Text>
      </View>
    </View>
  );
};
export default LoadingView;

const style = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingBottom: px2dp(200),
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
