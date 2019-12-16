/**
 * User: puti.
 * Time: 2019-11-07 19:36.
 */
import {Alert} from 'react-native';

export function withConfirm({title = '确认', message}) {
  return fun => arg => {
    Alert.alert(title, message, [
      {text: '取消', type: 'cancel'},
      {text: '确认', onPress: () => fun(arg)},
    ]);
  };
}
