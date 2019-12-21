/**
 * User: puti.
 * Time: 2019-12-17 19:40.
 */
import BaseContainer from '../../../components/BaseContainer';
import React from 'react';
import {SegmentedView} from 'teaset';
import ChainInfo from './ChainInfo';

export default function Explorer() {
  return (
    <BaseContainer title={'Explorer'}>
      <SegmentedView
        indicatorType={'boxWidth'}
        justifyItem={'scrollable'}
        style={{flex: 1}}>
        <SegmentedView.Sheet title={'Chain info'}>
          <ChainInfo />
        </SegmentedView.Sheet>
        <SegmentedView.Sheet title={'Hash data'} />
        <SegmentedView.Sheet title={'Sign message'} />
      </SegmentedView>
    </BaseContainer>
  );
}
