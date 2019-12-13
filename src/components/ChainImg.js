// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {useApi} from '../hooks';
import Icon from './Icon';
import {icons} from '../assets';

const CHAINS = {
  Kusama: icons.logo, // old name, the W3F nodes still has these
  'Kusama CC1': icons.logo,
  'Kusama CC2': icons.logo,
  'Kusama CC3': icons.logo,
};

// overrides based on the actual software node type
const NODES = {
  'edgeware-node': icons.logo,
  'node-template': icons.logo,
  'parity-polkadot': icons.logo,
  'polkadot-js': icons.logo,
  'substrate-node': icons.logo,
};

// overrides as specified
const LOGOS = {
  empty: icons.logo,
  edgeware: icons.logo,
  alexander: icons.logo,
  kusama: icons.logo,
  polkadot: icons.logo,
  substrate: icons.logo,
};

type Props = {
  logo: string,
  size: number,
};
export default function ChainImg(props: Props) {
  const {systemChain, systemName} = useApi();
  const icon =
    LOGOS[props.logo] || CHAINS[systemChain] || NODES[systemName] || icons.logo;
  return <Icon style={props.style} icon={icon} size={props.size} />;
}
