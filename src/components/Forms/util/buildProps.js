/**
 * User: puti.
 * Time: 2019-12-13 19:07.
 */
import {FieldProps} from '../FormItem';
import {showDecodeAddressQR} from '../../../utils/base';
import {isAddress} from '../../../utils';
import {
  TYPE_ADDRESS,
  TYPE_ADDRESS_WITHACCOUNT,
  TYPE_ADDRESS_WITHBOOK,
} from '../types';
import {RouteHelper} from 'react-navigation-easy-helper';
///地址类型的默认参数
const ADDRESS_PROPS: FieldProps = {
  rightIcon: 'scan1',
  validate: [{verify: isAddress, message: '钱包地址不正确'}],
  rightPress: async handleChange => {
    const res = await showDecodeAddressQR();
    handleChange(res.address);
  },
};
const ADDRESS_PROPS_WITH_BOOK: FieldProps = {
  rightIcon: 'FontAwesome/address-book',
  validate: [{verify: isAddress, message: '钱包地址不正确'}],
  rightPress: handleChange => {
    RouteHelper.navigate('AddressBook', {
      withAccount: true,
      onSelected: handleChange,
    });
  },
};
const ADDRESS_WITHACCOUNT: FieldProps = {
  rightIcon: 'FontAwesome/address-book',
  validate: [{verify: isAddress, message: '钱包地址不正确'}],
  rightPress: handleChange => {
    RouteHelper.navigate('AddressBook', {
      withAccount: true,
      withoutAddressBook: true,
      onSelected: handleChange,
    });
  },
};
const DEFAULT_PROPS = {
  [TYPE_ADDRESS]: ADDRESS_PROPS,
  [TYPE_ADDRESS_WITHBOOK]: ADDRESS_PROPS_WITH_BOOK,
  [TYPE_ADDRESS_WITHACCOUNT]: ADDRESS_WITHACCOUNT,
};

export default function buildProps(props) {
  const {type} = props;
  const defaultProp = DEFAULT_PROPS[type];
  if (defaultProp && defaultProp.validate) {
    props.validate && props.validate.push(...defaultProp.validate);
  }
  return {
    ...defaultProp,
    ...props,
  };
}
