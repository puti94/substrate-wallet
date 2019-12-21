/**
 * User: puti.
 * Time: 2019-12-11 15:03.
 */
import React from 'react';
import {TabView} from 'teaset';
import BaseContainer from '../components/BaseContainer';
import Icon from '../components/Icon';
import {theme} from '../config/theme';
import Home from './home';
import {Settings} from './set';
import Modules from './modules';

function Main() {
  return (
    <BaseContainer navBar={null}>
      <TabView
        style={{flex: 1}}
        type="projector"
        barStyle={{backgroundColor: theme.navigationColor}}>
        <TabView.Sheet
          title={i18n('Main.Home')}
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
          <Home />
        </TabView.Sheet>
        <TabView.Sheet
          title={i18n('Main.Module')}
          icon={<Icon icon={'appstore1'} size={px2dp(40)} />}
          activeIcon={
            <Icon icon={'appstore1'} size={px2dp(40)} color={theme.baseColor} />
          }>
          <Modules />
        </TabView.Sheet>
        <TabView.Sheet
          title={i18n('Main.Set')}
          icon={<Icon icon={'setting'} size={px2dp(40)} />}
          activeIcon={
            <Icon icon={'setting'} size={px2dp(40)} color={theme.baseColor} />
          }>
          <Settings />
        </TabView.Sheet>
      </TabView>
    </BaseContainer>
  );
}

export default Main;
