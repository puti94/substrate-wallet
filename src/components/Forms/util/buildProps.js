/**
 * User: puti.
 * Time: 2019-12-13 19:07.
 */
import {FieldProps} from '../FormItem';
import {showDecodeAddressQR} from '../../../utils/base';
import {isAddress} from '../../../utils';
import {TYPE_ADDRESS} from '../types';
///地址类型的默认参数
const ADDRESS_PROPS: FieldProps = {
  rightIcon: 'scan1',
  validate: [{verify: isAddress, message: '钱包地址不正确'}],
  rightPress: async handleChange => {
    const res = await showDecodeAddressQR();
    handleChange(res.address);
  },
};
const DEFAULT_PROPS = {
  [TYPE_ADDRESS]: ADDRESS_PROPS,
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
