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
import BlockHeaders from '../components/BlockHeaders';
import {theme} from '../../../config/theme';
import Events from './Events';
import {EventsContext} from '../../../components/query/Events';
import SimpleTab from '../../../components/SimpleTab';

export default function ChainInfo() {
  const [tabIndex, setTabIndex] = useState(0);
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
      <SimpleTab
        tabs={['recent blocks', 'recent events']}
        index={tabIndex}
        setTabIndex={setTabIndex}
      />
      {tabIndex === 0 && <BlockHeaders />}
      {tabIndex === 1 && <Events events={events} />}
    </BaseContainer>
  );
}
