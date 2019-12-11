// Copyright 2017-2019 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {assert} from '@polkadot/util';

import {ApiConsumer} from '../ApiContext';

export default function withApi(Inner, defaultProps = {}) {
  return class WithApi extends React.PureComponent {
    render() {
      return (
        <ApiConsumer>
          {apiProps => {
            assert(
              apiProps && apiProps.api,
              "Application root must be wrapped inside 'react-api/Api' to provide API context",
            );
            return <Inner {...defaultProps} {...apiProps} {...this.props} />;
          }}
        </ApiConsumer>
      );
    }
  };
}
