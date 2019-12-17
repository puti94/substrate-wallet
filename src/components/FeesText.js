/**
 * User: puti.
 * Time: 2019-12-11 20:41.
 */

import React, {PureComponent} from 'react';
import {Text} from 'react-native';
import {withApi, withCalls} from '../react-api/with';
import {compactToU8a} from '@polkadot/util';
import BN from 'bn.js';
import {formatBalance} from '../utils/format';

const LENGTH_ADDRESS = 32 + 1; // publicKey + prefix
const LENGTH_ERA = 2; // assuming mortals
const LENGTH_SIGNATURE = 64; // assuming ed25519 or sr25519
const LENGTH_VERSION = 1; // 0x80 & version

const calcTxLength = (extrinsic, nonce, tip) => {
  return new BN(
    LENGTH_VERSION +
      LENGTH_ADDRESS +
      LENGTH_SIGNATURE +
      LENGTH_ERA +
      compactToU8a(nonce || 0).length +
      compactToU8a(tip || 0).length +
      (extrinsic ? extrinsic.encodedLength : 0),
  );
};

class FeesText extends PureComponent<{methods: string, args: Array}> {
  render() {
    let {
      transactionBaseFee = new BN(0),
      transactionByteFee = new BN(0),
      creationFee = new BN(0),
      transferFee = new BN(0),
      nextFeeMultiplier = new BN(0),
      system_accountNonce,
      api,
      accountsInfo,
      methods,
      args = [],
      onChange,
    } = this.props;
    transactionBaseFee = transactionBaseFee || new BN(0);
    transactionByteFee = transactionByteFee || new BN(0);
    creationFee = creationFee || new BN(0);
    nextFeeMultiplier = nextFeeMultiplier || new BN(0);
    transferFee = transferFee || new BN(0);
    let txLength = new BN(0);
    try {
      const [section, method] = methods.split('.');
      const extrinsic = api.tx[section][method](...args);
      txLength = calcTxLength(extrinsic, system_accountNonce);
    } catch (e) {}
    let value = transactionBaseFee
      .add(transactionByteFee.mul(txLength))
      .add(transferFee);
    //如果没有创建,添加创建手续费
    if (accountsInfo && !accountsInfo.accountIndex) {
      value = value.add(creationFee);
    }
    const coefficient = nextFeeMultiplier.mul(value).div(new BN(1000000000));
    value = value.add(coefficient);
    onChange && onChange(value);
    return <Text {...this.props}>{formatBalance(value)}</Text>;
  }
}

export default withApi(props => {
  let Inner;
  if (
    props.api.query.transactionPayment &&
    props.api.query.transactionPayment.baseFee
  ) {
    Inner = withCalls(
      ['consts.balances.creationFee', {propName: 'creationFee'}],
      ['consts.balances.transferFee', {propName: 'transferFee'}],
      ['query.transactionPayment.baseFee', {propName: 'transactionBaseFee'}],
      [
        'query.transactionPayment.nextFeeMultiplier',
        {propName: 'nextFeeMultiplier'},
      ],
      [
        'query.transactionPayment.weightFeeCoefficient',
        {propName: 'weightFeeCoefficient'},
      ],
      ['query.system.accountNonce', {paramName: 'accountId'}],
      ['query.transactionPayment.byteFee', {propName: 'transactionByteFee'}],
    )(FeesText);
  } else {
    Inner = withCalls(
      ['consts.balances.creationFee', {propName: 'creationFee'}],
      ['consts.balances.transferFee', {propName: 'transferFee'}],
      [
        'query.transactionPayment.nextFeeMultiplier',
        {propName: 'nextFeeMultiplier'},
      ],
      ['query.system.accountNonce', {paramName: 'accountId'}],
      props.receipt && [
        'derive.accounts.info',
        {paramName: 'receipt', propName: 'accountsInfo'},
      ],
      [
        'consts.transactionPayment.transactionBaseFee',
        {propName: 'transactionBaseFee'},
      ],
      [
        'consts.transactionPayment.transactionByteFee',
        {propName: 'transactionByteFee'},
      ],
    )(FeesText);
  }
  return <Inner {...props} />;
});
