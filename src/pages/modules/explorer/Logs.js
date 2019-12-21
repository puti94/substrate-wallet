// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {DigestItem} from '@polkadot/types/interfaces';
import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {getTypeDef, Struct, Tuple, Vec, Raw} from '@polkadot/types';
import Params from '../../../components/Params';
import {baseStyles, theme} from '../../../config/theme';
import Icon from '../../../components/Icon';

function formatU8a(value: Raw): React.ReactNode {
  return (
    <Params isDisabled params={[getTypeDef('Bytes').type]} values={[value]} />
  );
}

function formatStruct(struct) {
  const types = struct.Type;
  const params = Object.keys(types).map(name => getTypeDef(types[name]).type);
  const values = struct.toArray();

  return <Params isDisabled params={params} values={values} />;
}

function formatTuple(tuple) {
  const types = tuple.Types;
  const params = types.map(type => getTypeDef(type).type);
  const values = tuple.toArray();

  return <Params isDisabled params={params} values={values} />;
}

function formatVector(vector) {
  const type = getTypeDef(vector.Type);
  const values = vector.toArray().map(value => value);
  const params = values.map(() => type);

  return <Params isDisabled params={params} values={values} />;
}

function renderItem({}) {
  return function LogItem(item: DigestItem, index: number): React.ReactNode {
    let content: React.ReactNode;
    const [open, setOpen] = useState(false);
    if (item.value instanceof Struct) {
      content = formatStruct(item.value);
    } else if (item.value instanceof Tuple) {
      content = formatTuple(item.value);
    } else if (item.value instanceof Vec) {
      content = formatVector(item.value);
    } else if (item.value instanceof Raw) {
      content = formatU8a(item.value);
    } else {
      content = (
        <div>
          {item.value
            .toString()
            .split(',')
            .join(', ')}
        </div>
      );
    }

    return (
      <View style={baseStyles.cardItem} key={index}>
        <View>
          <Text style={{color: theme.content}}>{item.type.toString()}</Text>
        </View>
        <Text onPress={() => setOpen(!open)}>
          <Icon icon={open ? 'caretdown' : 'caretright'} />
          Details
        </Text>
        {open && <View style={{paddingLeft: px2dp(40)}}>{content}</View>}
      </View>
    );
  };
}

export default function Logs(props) {
  const {value} = props;

  if (!value || !value.length) {
    return null;
  }

  return value.map(renderItem(props));
}
