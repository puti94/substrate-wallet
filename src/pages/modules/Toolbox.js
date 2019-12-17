/**
 * User: puti.
 * Time: 2019-12-17 19:40.
 */
import BaseContainer from '../../components/BaseContainer';
import React from 'react';
import {SegmentedView} from 'teaset';
import RPCCalls from './RPCCalls';

export default function Toolbox() {
  return (
    <BaseContainer title={'Toolbox'}>
      <SegmentedView
        indicatorType={'boxWidth'}
        justifyItem={'scrollable'}
        style={{flex: 1}}>
        <SegmentedView.Sheet title={'RPCCalls'}>
          <RPCCalls />
        </SegmentedView.Sheet>
        <SegmentedView.Sheet title={'Hash data'} />
        <SegmentedView.Sheet title={'Sign message'} />
        <SegmentedView.Sheet title={'Verify signature'} />
      </SegmentedView>
    </BaseContainer>
  );
}
