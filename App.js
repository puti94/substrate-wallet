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
import {setActionSheetRef, setNoticeRef} from './src/utils/dialog';
import {BlockAuthors} from './src/components/query/BlockAuthors';
import {Events} from './src/components/query/Events';
import {ENDPOINT_DEFAULT} from './src/config/endpoints';
import {STORE_SETTING_ENDPOINT} from './src/config';
import ActionSheet from './src/components/ActionSheet';
setJSExceptionHandler(() => {}, true);
const App = () => {
  const [appReady, setAppReady] = useState(false);
  useEffect(() => {
    //初始化一些配置
    async function initData() {
      await localStorage.init();
      store.getActions().set.initData();
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
      <Api
        onUrlChange={url => localStorage.setItem(STORE_SETTING_ENDPOINT, url)}
        url={localStorage.getItem(STORE_SETTING_ENDPOINT) || ENDPOINT_DEFAULT}>
        <BlockAuthors>
          <Events>
            <TopView>
              <Navigator />
              <DropdownAlert
                closeInterval={2000}
                updateStatusBar={false}
                ref={ref => setNoticeRef(ref)}
              />
              <ActionSheet ref={setActionSheetRef} />
            </TopView>
          </Events>
        </BlockAuthors>
      </Api>
    </StoreProvider>
  );
};

export default App;
