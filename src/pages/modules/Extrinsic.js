/**
 * User: puti.
 * Time: 2019-12-17 19:40.
 */
import React from 'react';
import BaseContainer from '../../components/BaseContainer';

import {getTxOptions} from '../../utils/convert';

import Calls from './components/Calls';
import {useApi} from '../../hooks';

export default function Extrinsic({}) {
  const {api} = useApi();
  return (
    <BaseContainer useScrollView title={'Extrinsic submission'}>
      <Calls
        type={'tx'}
        initialModule={'system'}
        initialCallIndex={4}
        withSigner
        options={getTxOptions(api)}
      />
    </BaseContainer>
  );
}
