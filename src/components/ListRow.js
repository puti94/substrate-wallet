/**
 * User: puti.
 * Time: 2019-12-13 09:53.
 */
import {ListRow as TeasetListRow} from 'teaset';
import Icon from './Icon';
import React from 'react';

export default function ListRow({icon, ...props}) {
  return (
    <TeasetListRow
      icon={
        icon ? (
          <Icon style={{marginRight: px2dp(24)}} icon={icon} size={px2dp(30)} />
        ) : null
      }
      {...props}
    />
  );
}
