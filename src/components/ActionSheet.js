/**
 * User: puti.
 * Time: 2019-12-18 09:55.
 */
import NativeActionSheet from 'react-native-actionsheet';
import React, {Component} from 'react';

export default class ActionSheet extends Component {
  state = {
    title: '',
    message: '',
    cancelButtonIndex: -1,
    destructiveButtonIndex: -1,
    onPress: undefined,
    options: [],
  };

  show(params) {
    this.setState(params, () => {
      this.actionSheet.show();
    });
  }

  render() {
    return (
      <NativeActionSheet ref={o => (this.actionSheet = o)} {...this.state} />
    );
  }
}
