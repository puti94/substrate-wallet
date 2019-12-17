/**
 * User: puti.
 * Time: 2019-12-17 14:37.
 */
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import BaseContainer from '../../components/BaseContainer';
import CommonButton from '../../components/CommonButton';
import {shuffle} from '../../utils';
import {theme} from '../../config/theme';
import {showAlert, showLoading} from '../../utils/dialog';
import keyring from '@polkadot/ui-keyring';
import {useStoreActions} from 'easy-peasy';
import {RouteHelper} from 'react-navigation-easy-helper';

export default function ConfirmMnemonic(props) {
  const {mnemonic = '', password, name} = props;
  const [selectedList, setSelectedList] = useState([]);
  const [list, setList] = useState(shuffle(mnemonic.split(' ')));
  const setSelectedAccount = useStoreActions(
    actions => actions.accounts.setSelectedAccount,
  );
  return (
    <BaseContainer
      title={'备份助记词'}
      showNavBorder={false}
      useScrollView
      contentContainerStyle={{alignItems: 'center'}}>
      <Text style={styles.hint}>请按顺序点击助记词,以确保备份正确</Text>
      <View style={styles.selectedContainer}>
        {selectedList.map((t, i) => (
          <TouchableOpacity
            key={`${t}${i}`}
            onPress={() => {
              selectedList.splice(i, 1);
              setSelectedList([...selectedList]);
              setList([...list, t]);
            }}>
            <View style={styles.selectedView}>
              <Text style={styles.selectedText}>{t}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.unselectedContainer}>
        {list.map((t, i) => (
          <TouchableOpacity
            key={`${t}${i}`}
            onPress={() => {
              list.splice(i, 1);
              setSelectedList([...selectedList, t]);
              setList([...list]);
            }}
            style={styles.unselectedButton}>
            <View style={styles.unselectedView}>
              <Text style={styles.unselectedText}>{t}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <CommonButton
        title={i18n('Base.Confirm')}
        disabled={selectedList.length !== 12}
        onPress={async () => {
          if (selectedList.join(' ') !== mnemonic) {
            showAlert('助记词不正确');
            return;
          }
          const hide = showLoading('创建中');
          //通过显示loading解决安卓通过助记词导入js线程卡死问题
          const {json} = await new Promise(resolve => {
            setTimeout(
              () => {
                const result = keyring.addUri(mnemonic, password, {
                  name: name.trim(),
                  tags: [],
                });
                resolve(result);
              },
              Platform.OS === 'ios' ? 0 : 300,
            );
          });
          hide();
          setSelectedAccount(json.address);
          RouteHelper.reset('Main');
        }}
      />
    </BaseContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    marginTop: px2dp(19),
  },
  hint: {
    color: theme.title,
    fontSize: 14,
    marginTop: px2dp(32),
  },
  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: px2dp(660),
    height: px2dp(320),
    backgroundColor: '#FFF',
    borderRadius: px2dp(20),
    marginTop: px2dp(50),
    marginBottom: px2dp(40),
    overflow: 'hidden',
  },
  selectedView: {
    width: px2dp(220),
    height: px2dp(80),
    alignItems: 'center',
    justifyContent: 'center',
    borderRightColor: '#E5E5E5',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  selectedText: {
    color: '#35384B',
    fontSize: 14,
  },
  unselectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: px2dp(660),
    height: px2dp(320),
    marginBottom: px2dp(20),
  },
  unselectedButton: {
    marginBottom: px2dp(32),
    marginRight: px2dp(24),
  },
  unselectedView: {
    paddingHorizontal: px2dp(20),
    height: px2dp(60),
    borderRadius: px2dp(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#4A4F6A',
    borderWidth: StyleSheet.hairlineWidth,
  },
  unselectedText: {color: '#848796', fontSize: 14},
});
