/**
 * User: puti.
 * Time: 2019-12-17 19:40.
 */
import BaseContainer from '../../../components/BaseContainer';
import React, {useState, useContext} from 'react';
import {View, Text} from 'react-native';
import TimeNow from '../../../components/query/TimeNow';
import TimePeriod from '../../../components/query/TimePeriod';
import TotalIssuance from '../../../components/query/TotalIssuance';
import SummarySession from './SummarySession';
import BestFinalized from '../../../components/BestFinalized';
import BestNumber from '../../../components/BestNumber';
import CardSummary from '../../../components/CardSummary';
import BlockHeaders from './BlockHeaders';
import {theme} from '../../../config/theme';
import Events from './Events';
import {EventsContext} from '../../../components/query/Events';

export default function ChainInfo() {
  const [type, setType] = useState('block');
  const events = useContext(EventsContext);
  return (
    <BaseContainer
      navBar={null}
      title={'Toolbox'}
      useScrollView
      contentContainerStyle={{padding: px2dp(40)}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <CardSummary label={'last block'} style={{flex: 1}}>
          <TimeNow />
        </CardSummary>
        <CardSummary label={'target'} style={{flex: 1}}>
          <TimePeriod />
        </CardSummary>
        <CardSummary label={'total issuance'} style={{flex: 1}}>
          <TotalIssuance />
        </CardSummary>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: px2dp(30),
        }}>
        <SummarySession withEra={false} style={{flex: 1}} />
        <CardSummary label={'finalized'} style={{flex: 1}}>
          <BestFinalized />
        </CardSummary>
        <CardSummary label={'best'} style={{flex: 1}}>
          <BestNumber />
        </CardSummary>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: px2dp(30),
          height: px2dp(80),
          alignItems: 'center',
        }}>
        <Text
          onPress={() => setType('block')}
          style={{
            fontSize: 18,
            color: type === 'block' ? theme.title : theme.baseColor,
          }}>
          recent blocks
        </Text>
        <Text style={{fontSize: 18}}> / </Text>
        <Text
          onPress={() => setType('event')}
          style={{
            fontSize: 18,
            color: type === 'event' ? theme.title : theme.baseColor,
          }}>
          recent events
        </Text>
      </View>
      {type === 'block' && <BlockHeaders />}
      {type === 'event' && <Events events={events} />}
    </BaseContainer>
  );
}
