/**
 * User: puti.
 * Time: 2019-12-17 19:40.
 */
import BaseContainer from '../../components/BaseContainer';
import React from 'react';
import WebItem from './components/WebItem';
import {useApi} from '../../hooks';
import {icons} from '../../assets';

export default function Find() {
  const {ss58Format} = useApi();
  return (
    <BaseContainer
      style={{backgroundColor: 'white'}}
      hideLeft
      useScrollView
      title={'发现'}>
      <WebItem
        url={`https://puti94.github.io/vanity-address/?ss58Format=${ss58Format}`}
        title={'Vanity address'}
        describe={'Substrate 靓号地址急速生成器'}
      />
      <WebItem
        icon={icons.logo_light}
        url={'https://polkascan.io/'}
        title={'PolkaScan'}
        describe={'波卡多链区块浏览器'}
      />
      <WebItem
        url={'https://subscan.io/'}
        title={'SubScan'}
        describe={'波卡多链区块浏览器'}
      />
      <WebItem
        icon={icons.ic_polkadot_js}
        url={'https://polkadot.js.org/apps'}
        title={'Polkadot/Substrate Portal'}
        describe={'网页端钱包'}
      />
    </BaseContainer>
  );
}
