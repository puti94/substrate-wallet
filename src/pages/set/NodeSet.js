/**
 * User: puti.
 * Time: 2019-12-13 10:01.
 */
import BaseContainer from '../../components/BaseContainer';
import React, {useState} from 'react';
import {ENDPOINTS} from '../../config/endpoints';
import {ListRow, Toast} from 'teaset';
import {useApi} from '../../hooks';
import CommonButton from '../../components/CommonButton';
import Icon from '../../components/Icon';
import {checkNodeConnect} from '../../utils/base';
import {showLoading} from '../../utils/dialog';
import {RouteHelper} from 'react-navigation-easy-helper';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {STORE_SETTING_CUSTOM_ENDPOINTS} from '../../config';

export default function NodeSet() {
  const {endpoint, setApiUrl} = useApi();
  const customNodeList = useStoreState(state => state.set.customNodeList);
  const removeNode = useStoreActions(actions => actions.set.removeNode);
  const customList = customNodeList.map((t, i) => ({
    title: `Custom #${i + 1}`,
    text: `Node(${t})`,
    type: 'custom',
    value: t,
  }));
  const [node, setNode] = useState(endpoint);

  async function saveNode(url) {
    const hide = showLoading('Connecting');
    const _types = localStorage.getItem(
      `${STORE_SETTING_CUSTOM_ENDPOINTS}_${url}`,
    );
    const types = _types ? JSON.parse(_types) : {};
    try {
      await checkNodeConnect(url, types);
    } catch (e) {
      Toast.fail('Connect fail:' + e.message);
      hide();
      return false;
    }
    await setApiUrl(url, types);
    hide();
    return true;
  }

  return (
    <BaseContainer
      title={'Node set'}
      useScrollView
      rightIcon={'Entypo/save'}
      rightPress={async () => {
        const res = await saveNode(node);
        if (res) {
          RouteHelper.reset('Main');
        }
      }}>
      {[...ENDPOINTS, ...customList].map(t => (
        <ListRow
          title={t.title}
          onPress={() => {
            setNode(t.value);
          }}
          detail={t.text}
          swipeActions={
            t.type === 'custom' && [
              <ListRow.SwipeActionButton title="Cancel" />,
              <ListRow.SwipeActionButton
                title="Remove"
                type="danger"
                onPress={() => {
                  removeNode(t.value);
                }}
              />,
            ]
          }
          accessory={
            node === t.value ? (
              <Icon
                style={{marginLeft: px2dp(20)}}
                icon={'check'}
                size={px2dp(40)}
              />
            ) : null
          }
        />
      ))}
      <CommonButton
        onPress={async () => {
          RouteHelper.navigate('AddNode');
        }}
        icon={'Ionicons/md-add-circle-outline'}
        title={'Add Node'}
      />
    </BaseContainer>
  );
}
