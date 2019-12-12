/**
 * User: puti.
 * Time: 2019-12-11 15:42.
 */
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {configRoute} from 'react-navigation-easy-helper';
import {Launch} from './pages/Launch';
import {Accounts} from './pages/accounts';
import Home from './pages/Home';
import QRReading from './pages/QRReading';

const getAppNavigator = ({initialRouteName}) =>
  createStackNavigator(
    configRoute({
      Launch: {screen: Launch},
      Home: {screen: Home},
      Accounts: {screen: Accounts},
      QRReading: {screen: QRReading},
    }),
    {
      initialRouteName: initialRouteName,
      defaultNavigationOptions: {header: null},
    },
  );

export default function({initialRouteName}) {
  return createAppContainer(getAppNavigator({initialRouteName}));
}
