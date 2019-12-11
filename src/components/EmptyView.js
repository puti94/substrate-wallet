import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export function EmptyView(props) {
  const {emptyTitle = i18n('Base.Empty'), style} = props;
  return (
    <View style={[styles.emptyContainer, style]}>
      <Text
        style={{
          fontSize: 14,
          color: '#707070',
          marginTop: px2dp(114),
          textAlign: 'center',
        }}>
        {emptyTitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
