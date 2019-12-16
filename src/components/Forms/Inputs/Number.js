// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Input from './Input';

export default class NumberInput extends Input {
  buildProps(props) {
    return {
      keyboardType: 'numeric',
      ...props,
      onChangeText: this.onChange,
    };
  }

  onChange = value => {
    const {handleChange} = this.props;
    handleChange(`${this.normalizeCurrency(value)}`);
  };

  normalizeCurrency(value) {
    if (value === '') {
      return '';
    }
    return value.replace(/(\d*)(\.\d{0,8})?.*/, (match, p1, p2) => {
      return Number(p1) + (p2 || '');
    });
  }
}
