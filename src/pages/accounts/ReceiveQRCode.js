/**
 * User: puti.
 * Time: 2019-12-17 14:37.
 */
import React, {useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import BaseContainer from '../../components/BaseContainer';
import QRCode from 'react-native-qrcode-svg';
import {u8aToHex} from '@polkadot/util';
import {captureRefandShare} from '../../utils';
import AddressText from '../../components/AddressText';
import {toHex} from '../../utils/defaults';
import {useApi} from '../../hooks';
import {theme} from '../../config/theme';
import Identicon from '@polkadot/reactnative-identicon';
import AccountName from '../../components/AccountName';

const ReceiveQRCode = props => {
  const {address} = props;
  const cap = useRef(null);
  const {api, isApiConnected} = useApi();
  let genesisHash = isApiConnected ? u8aToHex(api.genesisHash) : '';
  const value = `substrate:${toHex(address)}:${genesisHash}`;
  return (
    <BaseContainer
      title={'收款'}
      useScrollView
      rightIcon={'Entypo/share-alternative'}
      rightPress={() => {
        captureRefandShare(cap.current);
      }}>
      <View style={styles.cards} ref={cap}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            backgroundColor: theme.baseColor,
            paddingVertical: px2dp(50),
          }}>
          <Identicon value={address} size={px2dp(80)} />
          <AccountName
            style={{color: 'white', fontSize: 16}}
            params={address}
          />
          <AddressText
            iconColor={'white'}
            showCopyIcon
            style={styles.address}
            address={address}
          />
        </View>
        <Text style={styles.hint}>收款地址</Text>
        <QRCode value={value} size={px2dp(400)} />
      </View>
    </BaseContainer>
  );
};

export default ReceiveQRCode;

const styles = StyleSheet.create({
  cards: {
    marginTop: px2dp(160),
    alignSelf: 'center',
    width: px2dp(658),
    alignItems: 'center',
    borderRadius: px2dp(20),
    backgroundColor: 'white',
    paddingBottom: px2dp(107),
    overflow: 'hidden',
  },
  name: {color: '#35384B', fontSize: 15},
  address: {
    width: '90%',
    color: 'white',
    fontSize: 12,
  },
  line: {
    marginTop: px2dp(46),
    height: theme.hairline,
    width: '100%',
    backgroundColor: '#848796',
  },
  hint: {
    color: '#35384B',
    fontSize: px2dp(36),
    marginTop: px2dp(62),
    marginBottom: px2dp(26),
  },
});
