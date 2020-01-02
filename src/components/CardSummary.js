// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';
import {View} from 'react-native';
import {UInt} from '@polkadot/types';
import {formatNumber, isUndefined} from '@polkadot/util';

import Progress, {Colors as ProgressColors} from './Progress';
import Labelled from './Labelled';

type ProgressProps = {
  color?: ProgressColors,
  hideValue?: boolean,
  isPercent?: boolean,
  total?: BN | UInt,
  value?: BN | UInt,
};

type Props = {
  children?: React.ReactNode,
  help?: React.ReactNode,
  label: React.ReactNode,
  progress?: ProgressProps,
};

function CardSummary({
  children,
  help,
  label,
  progress,
  style,
}: Props): React.ReactElement<Props> | null {
  const value = progress && progress.value;
  const total = progress && progress.total;
  const left =
    progress &&
    !isUndefined(value) &&
    !isUndefined(total) &&
    value.gten(0) &&
    total.gtn(0)
      ? value.gt(total)
        ? `>${progress.isPercent ? '100' : formatNumber(total)}`
        : progress.isPercent
        ? value
            .muln(100)
            .div(total)
            .toString()
        : formatNumber(value)
      : undefined;

  if (progress && isUndefined(left)) {
    return null;
  }
  return (
    <View style={[{alignItems: 'center'}, style]}>
      <Labelled help={help} label={label}>
        {children}
        {progress &&
          !progress.hideValue &&
          (!left || isUndefined(progress.total)
            ? '-'
            : `${left}${progress.isPercent ? '' : '/'}${
                progress.isPercent ? '%' : formatNumber(progress.total)
              }`)}
      </Labelled>
      {progress && <Progress color={'auto'} {...progress} />}
    </View>
  );
}

export default CardSummary;
