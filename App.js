/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useEffect, useState} from 'react';
import {StoreProvider} from 'easy-peasy';
import {store} from './src/store';
import SplashScreen from 'react-native-splash-screen';
import getNavigator from './src/Navigator';

const App = () => {
  const [appReady, setAppReady] = useState(false);
  useEffect(() => {
    //初始化一些配置
    async function initData() {
      await localStorage.init();
      setAppReady(true);
      SplashScreen.hide();
    }

    initData();
  }, []);
  if (!appReady) {
    return null;
  }
  const Navigator = getNavigator({
    initialRouteName: 'Launch',
  });
  return (
    <StoreProvider store={store}>
      <Navigator />
    </StoreProvider>
  );
};

export default App;
