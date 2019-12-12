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
import Api from './src/react-api/Api';
import {setJSExceptionHandler} from './src/utils/errorHandle';
import {TopView} from 'teaset';

setJSExceptionHandler(() => {}, true);
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
    initialRouteName: 'Home',
  });
  // let url = 'wss://testnet2.edgewa.re';
  let url = 'ws://127.0.0.1:9944/';
  return (
    <StoreProvider store={store}>
      <Api url={url}>
        <TopView>
          <Navigator />
        </TopView>
      </Api>
    </StoreProvider>
  );
};

export default App;
