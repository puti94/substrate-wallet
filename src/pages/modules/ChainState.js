/**
 * User: puti.
 * Time: 2019-12-17 19:40.
 */
import BaseContainer from '../../components/BaseContainer';
import React from 'react';
import {SegmentedView} from 'teaset';
import Calls from './components/Calls';
import {useApi} from '../../hooks';
import {getConstsOptions, getQueryOptions} from '../../utils/convert';

export default function ChainState() {
  const {api} = useApi();
  return (
    <BaseContainer title={'Toolbox'}>
      <SegmentedView
        indicatorType={'boxWidth'}
        justifyItem={'scrollable'}
        style={{flex: 1}}>
        <SegmentedView.Sheet title={'Storage'}>
          <BaseContainer navBar={null} useScrollView>
            <Calls
              type={'query'}
              initialModule={'timestamp'}
              initialCallIndex={1}
              options={getQueryOptions(api)}
            />
          </BaseContainer>
        </SegmentedView.Sheet>
        <SegmentedView.Sheet title={'Constants'}>
          <BaseContainer navBar={null} useScrollView>
            <Calls
              type={'consts'}
              initialModule={'babe'}
              initialCallIndex={0}
              options={getConstsOptions(api)}
            />
          </BaseContainer>
        </SegmentedView.Sheet>
        <SegmentedView.Sheet title={'Raw storage'} />
      </SegmentedView>
    </BaseContainer>
  );
}
