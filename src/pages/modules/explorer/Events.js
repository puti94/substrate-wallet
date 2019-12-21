// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, {useState, useContext} from 'react';
import {Text, View} from 'react-native';
import {formatNumber} from '@polkadot/util';
import {baseStyles, theme} from '../../../config/theme';
import Icon from '../../../components/Icon';
import {getTypeDef} from '@polkadot/types';
import {EventsContext} from '../../../components/query/Events';
import Params from '../../../components/Params';

type Props = {
  emptyLabel?: React.ReactNode,
  events: Array,
  eventClassName?: string,
  withoutIndex?: boolean,
};

function EventDisplay({value}) {
  const params = value.typeDef.map(({type}) => getTypeDef(type).type);
  const values = value.data;
  return <Params params={params} values={values} />;
}

function EventItem({event, extIndex}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={baseStyles.cardItem}>
      <View className="header">
        <Text style={{fontSize: 16, color: theme.content}}>
          {event.section}.{event.method}&nbsp;
          {extIndex !== -1 ? `(#${formatNumber(extIndex)})` : ''}
        </Text>
      </View>
      <View>
        <Text
          style={{fontSize: 12}}
          onPress={() => setOpen(!open)}
          numberOfLines={open ? 0 : 1}>
          <Icon icon={open ? 'caretdown' : 'caretright'} />
          {event.meta && event.meta.documentation
            ? event.meta.documentation.join(' ')
            : 'Details'}
        </Text>
        {open && <EventDisplay value={event} />}
      </View>
    </View>
  );
}

function Events({emptyLabel, withoutIndex, events}: Props) {
  if (!events || events.length === 0) {
    return <Text>{emptyLabel || 'no events available'}</Text>;
  }

  return (
    <>
      {events.map(({key, record: {event, phase}}) => {
        const extIndex =
          !withoutIndex && phase.isApplyExtrinsic ? phase.asApplyExtrinsic : -1;

        if (!event.method || !event.section) {
          return null;
        }

        return <EventItem event={event} extIndex={extIndex} key={key} />;
      })}
    </>
  );
}

export default Events;
