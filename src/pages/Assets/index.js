/**
 * User: puti.
 * Time: 2019-12-11 15:03.
 */
import React from 'react';
import {Button} from 'teaset';
import BaseContainer from '../../components/BaseContainer';
import {Drawer} from 'teaset';
import AccountsDrawer from './AccountsDrawer';
import {showDecodeAddressQR} from '../../utils/base';

export function Assets() {
  return (
    <BaseContainer
      title={'钱包'}
      leftIcon={'FontAwesome5/users'}
      rightIcon={'scan1'}
      rightPress={() => {
        showDecodeAddressQR().then(res => {});
      }}
      leftPress={() => {
        Drawer.open(<AccountsDrawer />);
      }}
      useScrollView>
      <Button title={'添加账户'} onPress={() => {}} />
    </BaseContainer>
  );
}
