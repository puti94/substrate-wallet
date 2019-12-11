/**
 * User: puti.
 * Time: 2019-12-11 15:42.
 */
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {configRoute} from 'react-navigation-easy-helper';
import {Launch} from './pages/Launch';

const getAppNavigator = ({initialRouteName}) =>
  createStackNavigator(
    configRoute({
      Launch: {screen: Launch},
    }),
    {
      initialRouteName: initialRouteName,
      defaultNavigationOptions: {header: null},
    },
  );

export default function({initialRouteName}) {
  return createAppContainer(getAppNavigator({initialRouteName}));
}
