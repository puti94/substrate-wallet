/**
 * User: puti.
 * Time: 2019-12-17 19:40.
 */
import React from 'react';
import BaseContainer from '../../components/BaseContainer';

import {getRpcOptions} from '../../utils/convert';

import {useApi} from '../../hooks';
import Calls from './components/Calls';

export default function RPCCalls() {
  const {api} = useApi();
  const options = getRpcOptions(api);
  return (
    <BaseContainer useScrollView navBar={null}>
      <Calls options={options} />
    </BaseContainer>
  );
}
