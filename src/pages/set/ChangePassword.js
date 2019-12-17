/**
 * User: puti.
 * Time: 2019-12-11 15:03.
 */
import React from 'react';
import BaseContainer from '../../components/BaseContainer';
import {
  buildFields,
  useForm,
  BaseForm,
  TYPE_PASSWORD,
} from '../../components/Forms';
import {isPassValid} from '../../utils';
import {useSelectedAccount} from '../../hooks';
import {showAlert} from '../../utils/dialog';
import keyring from '@polkadot/ui-keyring';
import {RouteHelper} from 'react-navigation-easy-helper';

export default function ChangePassword() {
  const createFields = buildFields([
    {
      label: '原始密码',
      prop: 'oldPass',
      type: TYPE_PASSWORD,
      required: true,
    },
    {
      prop: 'newPass',
      type: TYPE_PASSWORD,
      label: '新密码',
      validate: [
        {
          verify: isPassValid,
          message: '密码长度1-32位',
        },
      ],
    },
  ]);
  const account = useSelectedAccount();
  const form = useForm({
    fields: createFields,
    onSubmit: values => {
      const {oldPass, newPass} = values;
      try {
        if (!account.isLocked) {
          account.lock();
        }

        account.decodePkcs8(oldPass);
      } catch (error) {
        showAlert('密码错误');
        return;
      }
      try {
        keyring.encryptAccount(account, newPass);
        showAlert('修改成功');
      } catch (error) {
        showAlert('修改失败');
        return;
      }
      RouteHelper.goBack();
    },
  });
  return (
    <BaseContainer useScrollView title={'修改密码'}>
      <BaseForm fields={createFields} {...form} />
    </BaseContainer>
  );
}
