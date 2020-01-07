/**
 * User: puti.
 * Time: 2020-01-07 18:58.
 */
import Select from './Select';
import React from 'react';

export default function Bool({value, onChangeText, ...others}) {
  if (typeof value === 'undefined') {
    onChangeText('1');
  }
  return (
    <Select
      items={[{label: 'Yes', value: '-1'}, {label: 'No', value: '1'}]}
      value={value}
      onChangeText={onChangeText}
      {...others}
    />
  );
}
