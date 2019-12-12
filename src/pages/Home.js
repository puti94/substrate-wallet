/**
 * User: puti.
 * Time: 2019-12-11 15:03.
 */
import React from 'react';
import {TabView} from 'teaset';
import BaseContainer from '../components/BaseContainer';
import Icon from '../components/Icon';
import {theme} from '../config/theme';
import {Assets} from './Assets';

function Home() {
  return (
    <BaseContainer navBar={null}>
      <TabView
        style={{flex: 1}}
        type="projector"
        barStyle={{backgroundColor: theme.navigationColor}}>
        <TabView.Sheet
          title={'资产'}
          icon={
            <Icon
              icon={'MaterialCommunityIcons/home-circle'}
              size={px2dp(40)}
            />
          }
          activeIcon={
            <Icon
              icon={'MaterialCommunityIcons/home-circle'}
              size={px2dp(40)}
              color={theme.baseColor}
            />
          }>
          <Assets />
        </TabView.Sheet>
        <TabView.Sheet
          title={'模块'}
          icon={<Icon icon={'appstore1'} size={px2dp(40)} />}
          activeIcon={
            <Icon icon={'appstore1'} size={px2dp(40)} color={theme.baseColor} />
          }>
          {/*<Apps />*/}
        </TabView.Sheet>
        <TabView.Sheet
          title={'设置'}
          icon={<Icon icon={'setting'} size={px2dp(40)} />}
          activeIcon={
            <Icon icon={'setting'} size={px2dp(40)} color={theme.baseColor} />
          }>
          {/*<Setting />*/}
        </TabView.Sheet>
      </TabView>
    </BaseContainer>
  );
}

export default Home;
