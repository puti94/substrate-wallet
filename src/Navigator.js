/**
 * User: puti.
 * Time: 2019-12-11 15:42.
 */
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {configRoute} from 'react-navigation-easy-helper';
import {Launch} from './pages/Launch';
import {Accounts} from './pages/accounts';
import Main from './pages/Main';
import QRReading from './pages/QRReading';
import NodeSet from './pages/set/NodeSet';

const getAppNavigator = ({initialRouteName}) =>
  createStackNavigator(
    configRoute({
      Launch: {screen: Launch},
      Main: {screen: Main},
      Accounts: {screen: Accounts},
      QRReading: {screen: QRReading},
      NodeSet: {screen: NodeSet},
    }),
    {
      initialRouteName: initialRouteName,
      defaultNavigationOptions: {header: null},
    },
  );

export default function({initialRouteName}) {
  return createAppContainer(getAppNavigator({initialRouteName}));
}
