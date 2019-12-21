// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, {useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {HeaderExtended} from '@polkadot/api-derive';
import {formatNumber} from '@polkadot/util';
import LinkPolkascan from '../../../components/LinkPolkascan';
import {baseStyles, theme} from '../../../config/theme';
import Identicon from '@polkadot/reactnative-identicon';
import AccountName from '../../../components/AccountName';
import {BlockAuthorsContext} from '../../../components/query/BlockAuthors';
import {RouteHelper} from 'react-navigation-easy-helper';

type Props = {
  isSummary?: boolean,
  value?: HeaderExtended,
  withExplorer?: boolean,
  withLink?: boolean,
};

const renderDetails = ({
  number: blockNumber,
  extrinsicsRoot,
  parentHash,
  stateRoot,
}: HeaderExtended): React.ReactNode => {
  const parentHex = parentHash.toHex();

  return (
    <View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>parentHash</Text>
        <Text
          numberOfLines={1}
          ellipsizeMode={'middle'}
          style={styles.infoValue}>
          {blockNumber.unwrap().gtn(1) ? (
            <Text
              style={{color: '#4183c4'}}
              onPress={() => {
                RouteHelper.navigate('BlockDetail', {value: parentHex});
              }}>
              {parentHex}
            </Text>
          ) : (
            parentHex
          )}
        </Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>extrinsicsRoot</Text>
        <Text
          numberOfLines={1}
          ellipsizeMode={'middle'}
          style={styles.infoValue}>
          {extrinsicsRoot.toHex()}
        </Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>stateRoot</Text>
        <Text
          numberOfLines={1}
          ellipsizeMode={'middle'}
          style={styles.infoValue}>
          {stateRoot.toHex()}
        </Text>
      </View>
    </View>
  );
};

export function BlockHeader({
  isSummary,
  value,
  withExplorer,
  withLink,
  style,
}: Props): React.ReactElement<Props> | null {
  if (!value) {
    return null;
  }

  const hashHex = value.hash.toHex();
  const textNumber = formatNumber(value.number);

  return (
    <View style={[baseStyles.cardItem, style]}>
      <View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{fontSize: 18}}>
            {withLink ? (
              <Text
                style={{
                  color: '#4183c4',
                }}
                to={`/explorer/query/${hashHex}`}>
                {textNumber}
              </Text>
            ) : (
              textNumber
            )}{' '}
          </Text>
          <Text style={{flex: 1}} ellipsizeMode={'middle'} numberOfLines={1}>
            {hashHex}
          </Text>
          <View
            style={{
              width: px2dp(140),
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {value.author ? (
              <>
                <Identicon value={value.author} size={px2dp(50)} />
                <AccountName style={{fontSize: 12}} params={value.author} />
              </>
            ) : (
              undefined
            )}
          </View>
        </View>
      </View>
      {isSummary ? undefined : renderDetails(value)}
      {withExplorer ? <LinkPolkascan data={hashHex} type="block" /> : undefined}
    </View>
  );
}

// export default BlockHeader;

export default function BlockHeaders() {
  const {lastHeaders} = useContext(BlockAuthorsContext);
  return lastHeaders.map((header, index) => (
    <BlockHeader
      isSummary={!!index}
      key={header.number.toString()}
      value={header}
      withLink={!header.number.isEmpty}
    />
  ));
}

const styles = StyleSheet.create({
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: px2dp(35),
  },
  infoValue: {
    flex: 1,
  },
  infoLabel: {
    minWidth: px2dp(200),
    fontSize: 12,
    color: theme.content,
    textAlign: 'right',
    paddingRight: px2dp(20),
  },
});
