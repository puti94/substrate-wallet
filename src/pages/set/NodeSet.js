/**
 * User: puti.
 * Time: 2019-12-13 10:01.
 */
import BaseContainer from '../../components/BaseContainer';
import React, {useState} from 'react';
import {ENDPOINTS} from '../../config/endpoints';
import {ListRow, Toast} from 'teaset';
import {STORE_SETTING_CUSTOM_ENDPOINTS} from '../../config';
import {useApi} from '../../hooks';
import CommonButton from '../../components/CommonButton';
import Icon from '../../components/Icon';
import {checkNodeConnect} from '../../utils/base';
import {showLoading} from '../../utils/dialog';
import {RouteHelper} from 'react-navigation-easy-helper';

export default function NodeSet() {
  const {endpoint, setApiUrl} = useApi();
  const custom = localStorage.getItem(STORE_SETTING_CUSTOM_ENDPOINTS);
  const customList = (custom ? JSON.parse(custom) : []).map((t, i) => ({
    text: `Custom #${i + 1}`,
    title: `Custom Node(${t})`,
    value: t,
  }));
  const [node, setNode] = useState(endpoint);
  const [list, setList] = useState(customList);

  async function saveNode() {
    const hide = showLoading('Connecting');
    try {
      await checkNodeConnect(node);
    } catch (e) {
      Toast.fail('Not Connect');
      return;
    }
    await setApiUrl(node);
    hide();
    RouteHelper.reset('Main');
  }

  return (
    <BaseContainer
      title={'Node set'}
      useScrollView
      rightIcon={'Entypo/save'}
      rightPress={saveNode}>
      {[...ENDPOINTS, ...list].map(t => (
        <ListRow
          title={t.title}
          onPress={() => {
            setNode(t.value);
          }}
          detail={t.text}
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
        onPress={() => {}}
        icon={'Ionicons/md-add-circle-outline'}
        title={'Add Node'}
      />
    </BaseContainer>
  );
}
