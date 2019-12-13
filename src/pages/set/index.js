/**
 * User: puti.
 * Time: 2019-12-13 09:30.
 */

import BaseContainer from '../../components/BaseContainer';
import React from 'react';
import ListRow from '../../components/ListRow';
import {RouteHelper} from 'react-navigation-easy-helper';

export function Settings() {
  return (
    <BaseContainer hideLeft title={'设置'}>
      <ListRow
        icon={'FontAwesome5/network-wired'}
        title={'设置节点'}
        onPress={() => {
          RouteHelper.navigate('NodeSet');
        }}
      />
    </BaseContainer>
  );
}
