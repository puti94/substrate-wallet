// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';

import Icon from './Icon';

function LabelHelp({help, style}: Props): React.ReactElement<Props> {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const _toggleTooltip = (): void => setIsTooltipOpen(!isTooltipOpen);

  return (
    <View style={style}>
      <TouchableOpacity onPress={_toggleTooltip}>
        <Icon icon={'help'} size={px2dp(30)} />
      </TouchableOpacity>
      {/*{isTooltipOpen && (*/}
      {/*  <Tooltip*/}
      {/*    text={help}*/}
      {/*    trigger='controlled-trigger'*/}
      {/*  />*/}
      {/*)}*/}
    </View>
  );
}

export default LabelHelp;
