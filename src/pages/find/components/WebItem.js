/**
 * User: puti.
 * Time: 2020-01-11 16:11.
 */
import React from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import Icon from '../../../components/Icon';
import {icons} from '../../../assets';
import {RouteHelper} from 'react-navigation-easy-helper';
import {theme} from '../../../config/theme';

export default function WebItem({icon = icons.logo, title, url, describe}) {
  return (
    <TouchableOpacity
      onPress={() => {
        RouteHelper.navigate('Web', {url});
      }}
      style={{flexDirection: 'row', padding: px2dp(30), alignItems: 'center'}}>
      <Icon icon={icon} size={px2dp(100)} />
      <View style={{marginLeft: px2dp(20)}}>
        <Text style={{fontSize: 18, fontWeight: '500', color: theme.title}}>
          {title}
        </Text>
        <Text style={{fontSize: 14, color: theme.content}}>{describe}</Text>
      </View>
    </TouchableOpacity>
  );
}
