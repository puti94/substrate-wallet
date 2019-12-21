/**
 * User: puti.
 * Time: 2019-12-11 15:03.
 */
import React from 'react';
import {Text} from 'react-native';
import BaseContainer from '../../components/BaseContainer';
import {
  buildFields,
  useForm,
  BaseForm,
  TYPE_NUMBER,
  TYPE_ADDRESS_WITHBOOK,
} from '../../components/Forms';
import {showDecodeAddressQR} from '../../utils/base';
import FeesText from '../../components/FeesText';
import {toBN} from '../../utils/format';
import BN from 'bn.js';
import {useSelectedAccount, useSendTx} from '../../hooks';
import AvailableText from '../../components/AvailableText';
import {RouteHelper} from 'react-navigation-easy-helper';
import {showLoading} from '../../utils/dialog';

export default function Transfer({receipt, amount}) {
  const account = useSelectedAccount();
  const sendTx = useSendTx();
  let isSubmitting = false;
  let fees = new BN(0);
  let balance = new BN(0);
  const form = useForm({
    initialValues: {receipt, amount},
    fields: buildFields([
      {
        label: '收款地址',
        prop: 'receipt',
        type: TYPE_ADDRESS_WITHBOOK,
        required: true,
      },
      {
        prop: 'amount',
        type: TYPE_NUMBER,
        label: '数量',
        required: true,
        hint: (
          <AvailableText
            address={account.address}
            onChange={v => (balance = v)}
          />
        ),
        validate: [
          {
            verify: v => {
              return toBN(v).toString() !== '0';
            },
            message: '金额不能为0',
          },
          {
            verify: v => {
              console.log('验证', balance.toString(), fees.toString());
              return toBN(v)
                .add(fees)
                .lte(balance);
            },
            message: '余额不足',
          },
        ],
      },
    ]),
    onSubmit: async values => {
      const {receipt, amount} = values;
      if (isSubmitting) {
        return;
      }
      isSubmitting = true;
      const hide = showLoading('Waiting');
      const isSend = await sendTx({
        section: 'balances',
        method: 'transfer',
        args: [receipt, toBN(amount).toString()],
        txFailedCb: res => {
          console.log('txFailedCb', res);
        },
        txUpdateCb: res => {
          console.log('txUpdateCb', res);
        },
        txSuccessCb: res => {
          console.log('txSuccessCb', res);
        },
        txStartCb: res => {
          console.log('txSuccessCb', res);
        },
      });
      hide();
      if (isSend === false) {
        isSubmitting = false;
        return;
      }
      RouteHelper.goBack();
    },
  });
  return (
    <BaseContainer
      useScrollView
      title={'转账'}
      rightIcon={'scan1'}
      rightPress={() => {
        showDecodeAddressQR().then(res => {
          form.setFieldValue('receipt', res.address);
        });
      }}>
      <BaseForm {...form} submitTitle={'提交'}>
        <Text style={{marginTop: px2dp(40), marginLeft: px2dp(25)}}>
          手续费:
          <FeesText
            onChange={value => {
              fees = value;
            }}
            methods={'balances.transfer'}
            args={[form.values.receipt, toBN(form.values.amount).toString()]}
            receipt={form.values.receipt}
          />
        </Text>
      </BaseForm>
    </BaseContainer>
  );
}
