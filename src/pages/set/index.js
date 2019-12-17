/**
 * User: puti.
 * Time: 2019-12-13 09:30.
 */

import BaseContainer from '../../components/BaseContainer';
import React from 'react';
import ListRow from '../../components/ListRow';
import {RouteHelper} from 'react-navigation-easy-helper';
import {useSelectedAccount} from '../../hooks';

export function Settings() {
  const account = useSelectedAccount();
  return (
    <BaseContainer hideLeft useScrollView title={'设置'}>
      <ListRow
        title={'设置节点'}
        onPress={() => {
          RouteHelper.navigate('NodeSet');
        }}
      />
      {!!account && (
        <ListRow
          title={'钱包管理'}
          onPress={() => {
            RouteHelper.navigate('AccountSet');
          }}
        />
      )}
      <ListRow
        title={'关于我们'}
        onPress={() => {
          RouteHelper.navigate('AboutUs');
        }}
      />
    </BaseContainer>
  );
}
