/**
 * User: puti.
 * Time: 2020-01-07 18:58.
 */
import Select from './Select';
import React, {useEffect, useState} from 'react';
import {useApi} from '../../../hooks';
import {createType, getTypeDef} from '@polkadot/types';

export default function Enum({originType, value, onChangeText, ...others}) {
  const {api} = useApi();
  const [items, setItems] = useState([]);
  useEffect(() => {
    const rawType = createType(api.registry, originType).toRawType();
    const typeDef = getTypeDef(rawType);
    const _items = typeDef.sub.map(({name}) => ({
      label: name,
      value: name,
    }));
    setItems(_items);
  }, [api.registry, originType]);
  if (typeof value === 'undefined' && items.length !== 0) {
    onChangeText(items[0].value);
  }
  return (
    <Select
      items={items}
      value={value}
      onChangeText={onChangeText}
      {...others}
    />
  );
}
