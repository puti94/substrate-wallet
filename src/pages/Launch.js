/**
 * User: puti.
 * Time: 2019-12-11 15:03.
 */
import React from 'react';
import {Button} from 'teaset';
import BaseContainer from '../components/BaseContainer';
import Icon from '../components/Icon';

export function Launch() {
  return (
    <BaseContainer title={'hh'}>
      <Icon icon={'left'} color={'red'} size={px2dp(550)} />
      <Button title={i18n('Launch.Create')} />
      <Button title={i18n('Launch.Import')} />
    </BaseContainer>
  );
}
