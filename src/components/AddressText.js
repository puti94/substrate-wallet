/**
 * User: puti.
 * Time: 2019/12/11 4:51 PM.
 */

import React from 'react';
import CopyText, {Props as CopyTextProps} from './CopyText';
import {encodeAddress, decodeAddress} from '@polkadot/util-crypto';
import {useApi} from '../hooks';

type Props = {
  address: string,
} & CopyTextProps;

const AddressText = (props: Props) => {
  const {ss58Format} = useApi();
  const {address, ...otherProps} = props;
  return (
    <CopyText numberOfLines={1} ellipsizeMode={'middle'} {...otherProps}>
      {encodeAddress(decodeAddress(address), ss58Format)}
    </CopyText>
  );
};

export default AddressText;
