/**
 * User: puti.
 * Time: 2019-12-16 14:37.
 */
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {mnemonicGenerate} from '@polkadot/util-crypto';
import BaseContainer from '../../components/BaseContainer';

import CommonButton from '../../components/CommonButton';
import {RouteHelper} from 'react-navigation-easy-helper';
import {theme} from '../../config/theme';

const Backup = props => {
  const [mnemonic, setMnemonic] = useState('');
  const initKey = async () => {
    const key = await mnemonicGenerate();
    setMnemonic(key);
  };
  useEffect(() => {
    initKey();
  }, []);
  return (
    <BaseContainer
      title={'备份提示'}
      showNavBorder={false}
      useScrollView
      contentContainerStyle={{alignItems: 'center'}}>
      <Text style={styles.hint}>获得助记词等于拥有钱包资产所有权</Text>
      <View style={styles.container}>
        {mnemonic.split(' ').map(t => (
          <View style={styles.singleView}>
            <Text style={styles.singleText}>{t}</Text>
          </View>
        ))}
      </View>
      <CommonButton
        title={'下一步'}
        onPress={() => {
          RouteHelper.navigate('ConfirmMnemonic', {mnemonic, ...props});
        }}
      />
    </BaseContainer>
  );
};

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
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: px2dp(660),
    backgroundColor: 'white',
    borderRadius: px2dp(20),
    marginTop: px2dp(101),
    marginBottom: px2dp(100),
    overflow: 'hidden',
  },
  singleView: {
    width: px2dp(220),
    height: px2dp(106),
    alignItems: 'center',
    justifyContent: 'center',
    borderRightColor: '#E5E5E5',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  singleText: {color: '#35384B', fontSize: 14},
});

export default Backup;
