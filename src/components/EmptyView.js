import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from './Icon';
import {theme} from '../config/theme';

type Props = {
  emptyTitle?: string,
};

export function EmptyView(props: Props) {
  const {emptyTitle = i18n('Base.Empty'), style} = props;
  return (
    <View style={[styles.emptyContainer, style]}>
      <Icon
        style={{marginTop: px2dp(114)}}
        icon={'frowno'}
        size={px2dp(120)}
        color={theme.warning}
      />
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
