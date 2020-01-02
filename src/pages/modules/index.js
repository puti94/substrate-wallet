/**
 * User: puti.
 * Time: 2019-12-17 19:40.
 */
import BaseContainer from '../../components/BaseContainer';
import React from 'react';
import RouteItem from './components/RouteItem';

export default function Modules() {
  return (
    <BaseContainer hideLeft useScrollView title={'模块'}>
      <RouteItem
        icon={'FontAwesome5/internet-explorer'}
        title={'Explorer'}
        routeName={'Explorer'}
      />
      <RouteItem
        icon={'FontAwesome5/hammer'}
        title={'Toolbox'}
        routeName={'Toolbox'}
      />
      <RouteItem
        icon={'FontAwesome5/hammer'}
        title={'Claim Tokens'}
        needApis={['query.claims.claims']}
        routeName={''}
      />
      <RouteItem
        icon={'FontAwesome5/sun'}
        title={'Staking'}
        needApis={['tx.staking.bond']}
        routeName={'Staking'}
      />
      <RouteItem
        icon={'FontAwesome/exchange'}
        title={'Extrinsics'}
        needsAccounts
        routeName={'Extrinsic'}
      />
      <RouteItem
        icon={'FontAwesome5/hammer'}
        title={'Democracy'}
        needApis={['tx.democracy.notePreimage']}
        routeName={''}
      />
      <RouteItem
        icon={'FontAwesome5/coins'}
        title={'Chain state'}
        routeName={'ChainState'}
      />
    </BaseContainer>
  );
}
