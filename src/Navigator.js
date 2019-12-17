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
import ExportKeystore from './pages/set/ExportKeystore';
import ReceiveQRCode from './pages/accounts/ReceiveQRCode';
import Transfer from './pages/accounts/Transfer';
import WebPage from './pages/web';
import AboutUs from './pages/set/AboutUs';
import Toolbox from './pages/modules/Toolbox';
import ChainState from './pages/modules/ChainState';

const getAppNavigator = ({initialRouteName}) =>
  createStackNavigator(
    configRoute({
      Launch: {screen: Launch},
      Main: {screen: Main},
      Accounts: {screen: Accounts},
      AddAccount: {screen: AddAccount},
      ChangePassword: {screen: ChangePassword},
      AccountSet: {screen: AccountSet},
      ExportKeystore: {screen: ExportKeystore},
      ReceiveQRCode: {screen: ReceiveQRCode},
      Backup: {screen: Backup},
      ConfirmMnemonic: {screen: ConfirmMnemonic},
      ChainState: {screen: ChainState},
      Toolbox: {screen: Toolbox},
      AboutUs: {screen: AboutUs},
      Web: {screen: WebPage},
      Transfer: {screen: Transfer},
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
