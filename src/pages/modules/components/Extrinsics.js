// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {formatNumber} from '@polkadot/util';
import AddressText from '../../../components/AddressText';
import LinkPolkascan from '../../../components/LinkPolkascan';
import {baseStyles, theme} from '../../../config/theme';
import {useApi} from '../../../hooks';
import Icon from '../../../components/Icon';
import Call from '../../../components/Call';

function RenderExtrinsic({props, extrinsic, index, registry}) {
  const [open, setOpen] = useState(false);
  const {blockNumber} = props;
  const {meta, method, section} = registry.findMetaCall(extrinsic.callIndex);
  const isMortal = extrinsic.era.isMortalEra;
  let eraEnd;
  let eraStart;
  if (blockNumber && isMortal) {
    const mortalEra = extrinsic.era.asMortalEra;

    eraEnd = mortalEra.death(blockNumber.toNumber());
    eraStart = mortalEra.birth(blockNumber.toNumber());
  }
  return (
    <View style={baseStyles.cardItem} key={`extrinsic:${index}`}>
      <View>
        <Text style={{color: theme.content}}>
          {section}.{method}&nbsp;(#{formatNumber(index)})
        </Text>
        {extrinsic.isSigned && (
          <View>
            <View>
              <AddressText value={extrinsic.signer} />
            </View>
            <Text>
              {'index'} {formatNumber(extrinsic.nonce)}
            </Text>
          </View>
        )}
      </View>
      <View>
        <Text onPress={() => setOpen(!open)} numberOfLines={open ? 0 : 1}>
          <Icon icon={open ? 'caretdown' : 'caretright'} />
          {meta ? meta.documentation.join(' ') : 'Details'}
        </Text>
        {open && (
          <Call
            mortality={
              isMortal
                ? blockNumber
                  ? `mortal, valid from ${formatNumber(
                      eraStart,
                    )} to ${formatNumber(eraEnd)}`
                  : 'mortal'
                : 'immortal'
            }
            tip={extrinsic.tip.toBn()}
            value={extrinsic}
            withHash
          />
        )}
      </View>
      {extrinsic.isSigned ? (
        <LinkPolkascan data={extrinsic.hash.toHex()} type="extrinsic" />
      ) : null}
    </View>
  );
}

export default function Extrinsics(props) {
  const {value} = props;
  const {api} = useApi();
  return (
    <View>
      {!!value &&
        value.map((extrinsic, index) => {
          try {
            return (
              <RenderExtrinsic
                index={index}
                registry={api.registry}
                extrinsic={extrinsic}
                props={props}
              />
            );
          } catch (error) {
            console.error(error);

            return <Text>{'Unable to render extrinsic'}</Text>;
          }
        })}
      {!!value && value.length === 0 && (
        <View style={baseStyles.cardItem}>
          <Text>{'No pending extrinsics are in the queue'}</Text>
        </View>
      )}
    </View>
  );
}
