/**
 * User: puti.
 * Time: 2019-12-13 09:30.
 */

import BaseContainer from '../../components/BaseContainer';
import React from 'react';
import ListRow from '../../components/ListRow';
import {RouteHelper} from 'react-navigation-easy-helper';
import {useSelectedAccount} from '../../hooks';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {showActionSheet} from '../../utils/dialog';
import {LANGS, setI18nConfig} from '../../i18n';

export function Settings() {
  const account = useSelectedAccount();
  const lang = useStoreState(state => state.set.lang);
  const setLang = useStoreActions(actions => actions.set.setLang);
  return (
    <BaseContainer hideLeft useScrollView title={'设置'}>
      <ListRow
        title={'Address book'}
        onPress={() => {
          RouteHelper.navigate('AddressBook');
        }}
      />
      <ListRow
        title={'多语言'}
        detail={LANGS[LANGS.findIndex(t => t.lang === lang)].label}
        onPress={() => {
          showActionSheet({
            title: '切换语言',
            cancelButtonIndex: LANGS.length,
            options: [...LANGS.map(t => t.label), i18n('Base.Cancel')],
            onPress: index => {
              setI18nConfig(LANGS[index].lang);
              setLang(LANGS[index].lang);
              RouteHelper.reset('Main');
            },
          });
        }}
      />
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
