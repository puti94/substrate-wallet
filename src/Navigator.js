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
import AddAccount from './pages/accounts/AddAccount';
import AccountSet from './pages/set/AccountSet';
import ChangePassword from './pages/set/ChangePassword';
import Backup from './pages/accounts/Backup';
import ConfirmMnemonic from './pages/accounts/ConfirmMnemonic';

const getAppNavigator = ({initialRouteName}) =>
  createStackNavigator(
    configRoute({
      Launch: {screen: Launch},
      Main: {screen: Main},
      Accounts: {screen: Accounts},
      AddAccount: {screen: AddAccount},
      ChangePassword: {screen: ChangePassword},
      AccountSet: {screen: AccountSet},
      Backup: {screen: Backup},
      ConfirmMnemonic: {screen: ConfirmMnemonic},
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
