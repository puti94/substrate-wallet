/**
 * User: puti.
 * Time: 2019-12-13 09:30.
 */

import BaseContainer from '../../components/BaseContainer';
import React from 'react';
import {View, Text} from 'react-native';
import ListRow from '../../components/ListRow';
import {RouteHelper} from 'react-navigation-easy-helper';
import Icon from '../../components/Icon';
import {icons} from '../../assets';
import {getReadableVersion} from 'react-native-device-info';

export default function AboutUs() {
  return (
    <BaseContainer useScrollView title={'关于我们'}>
      <View style={{alignItems: 'center', paddingVertical: px2dp(50)}}>
        <Icon icon={icons.logo} size={px2dp(140)} />
        <Text style={{marginTop: px2dp(40)}}>波卡钱包</Text>
        <Text style={{marginTop: px2dp(20)}}>v{getReadableVersion()}</Text>
      </View>
      <ListRow
        title={'Website'}
        detail={'https://www.github.com/puti94'}
        onPress={() => {
          RouteHelper.navigate('Web', {url: 'https://www.github.com/puti94'});
        }}
      />
      <ListRow
          title={'Website'}
          detail={'https://puti94.github.io/vanity-address/'}
          onPress={() => {
            RouteHelper.navigate('Web', {url: 'https://puti94.github.io/vanity-address/'});
          }}
      />
    </BaseContainer>
  );
}
