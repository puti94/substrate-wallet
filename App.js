/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useEffect, useState} from 'react';
import {StoreProvider} from 'easy-peasy';
import DropdownAlert from 'react-native-dropdownalert';
import {store} from './src/store';
import SplashScreen from 'react-native-splash-screen';
import getNavigator from './src/Navigator';
import Api from './src/react-api/Api';
import {setJSExceptionHandler} from './src/utils/errorHandle';
import {TopView} from 'teaset';
import {setNoticeRef} from './src/utils/dialog';
import {BlockAuthors} from './src/components/query/BlockAuthors';
import {Events} from './src/components/query/Events';
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
    initialRouteName: 'Main',
  });
  return (
    <StoreProvider store={store}>
      <Api>
        <BlockAuthors>
          <Events>
            <TopView>
              <Navigator />
              <DropdownAlert
                closeInterval={2000}
                updateStatusBar={false}
                ref={ref => setNoticeRef(ref)}
              />
            </TopView>
          </Events>
        </BlockAuthors>
      </Api>
    </StoreProvider>
  );
};

export default App;
