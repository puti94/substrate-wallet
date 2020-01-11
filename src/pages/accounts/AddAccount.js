/**
 * User: puti.
 * Time: 2019-12-11 15:03.
 */
import React, {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {SegmentedView} from 'teaset';
import BaseContainer from '../../components/BaseContainer';
import {
  buildFields,
  useForm,
  BaseForm,
  TYPE_PASSWORD,
  TYPE_AREA,
  TYPE_SELECT,
} from '../../components/Forms';
import {isKeystore, isMnemonic, isPassValid} from '../../utils';
import {RouteHelper} from 'react-navigation-easy-helper';
import keyring from '@polkadot/ui-keyring';
import {showAlert, showLoading} from '../../utils/dialog';
import {useStoreActions} from 'easy-peasy';
import {seedValidate} from '../../utils/defaults';

function CreateView() {
  const form = useForm({
    fields: buildFields([
      {
        label: '钱包名称',
        prop: 'name',
        required: true,
      },
      {
        label: '密码',
        prop: 'password',
        type: TYPE_PASSWORD,
        validate: [
          {
            verify: isPassValid,
            message: '密码长度1-32位',
          },
        ],
      },
      {
        prop: 'repeatPassword',
        type: TYPE_PASSWORD,
        label: '重复密码',
        required: true,
        validate: [
          {
            verify: (value, values) => value === values.password,
            message: '密码不一致',
          },
        ],
      },
    ]),
    onSubmit: values => {
      RouteHelper.navigate('Backup', values);
    },
  });
  return <BaseForm {...form} />;
}

function ImportView() {
  const [type, setType] = useState('keystore');
  const typeItem = {
    label: '类型',
    prop: 'type',
    type: TYPE_SELECT,
    items: [
      {label: 'Keystore', value: 'keystore'},
      {label: '助记词', value: 'mnemonic'},
      {label: '种子', value: 'seed'},
    ],
    required: true,
  };
  const passwordItem = {
    label: '密码',
    prop: 'password',
    type: TYPE_PASSWORD,
    validate: [
      {
        verify: isPassValid,
        message: '密码长度1-32位',
      },
    ],
  };
  const keystoreItem = {
    label: 'Keystore',
    prop: 'keystore',
    type: TYPE_AREA,
    validate: [
      {
        verify: isKeystore,
        message: 'Keystore格式不正确',
      },
    ],
    required: true,
  };
  const mnemonicItem = {
    label: type === 'seed' ? '种子' : '助记词',
    prop: 'mnemonic',
    type: TYPE_AREA,
    validate: [
      {
        verify: type === 'seed' ? seedValidate : isMnemonic,
        message: type === 'seed' ? 'seed不正确' : '助记词长度正确',
      },
    ],
    required: true,
  };
  const nameItem = {
    label: '钱包名称',
    prop: 'name',
    required: true,
  };

  const setSelectedAccount = useStoreActions(
    actions => actions.accounts.setSelectedAccount,
  );

  const form = useForm({
    fields: buildFields(
      [
        typeItem,
        type === 'keystore' ? keystoreItem : mnemonicItem,
        type === 'keystore' ? null : nameItem,
        passwordItem,
      ].filter(t => t),
    ),
    initialValues: {type: 'keystore'},
    onSubmit: async values => {
      const {type, password, mnemonic, keystore, name} = values;
      let pair;
      if (type === 'keystore') {
        try {
          pair = keyring.restoreAccount(JSON.parse(keystore), password);
        } catch (e) {
          console.log('错误', e);
          showAlert('密码不正确');
        }
      } else if (type === 'mnemonic' || type === 'seed') {
        let hide = showLoading('导入中');
        const result = await new Promise(resolve => {
          setTimeout(
            () => {
              const _result = keyring.addUri(mnemonic, password, {
                name: name.trim(),
                tags: [],
              });
              resolve(_result);
            },
            Platform.OS === 'ios' ? 0 : 300,
          );
        });
        pair = result.pair;
        hide();
      }
      if (!pair) {
        return;
      }
      setSelectedAccount(pair.address);
      RouteHelper.reset('Main');
    },
  });
  useEffect(() => {
    console.log('值', form.values.type);
    setType(form.values.type);
  }, [form.values.type]);
  return <BaseForm {...form} />;
}

export default function AddAccount() {
  return (
    <BaseContainer title={'添加钱包'}>
      <SegmentedView indicatorType={'boxWidth'} style={{flex: 1}}>
        <SegmentedView.Sheet title={'创建'}>
          <BaseContainer navBar={null} useScrollView>
            <CreateView />
          </BaseContainer>
        </SegmentedView.Sheet>
        <SegmentedView.Sheet title={'导入'}>
          <BaseContainer navBar={null} useScrollView>
            <ImportView />
          </BaseContainer>
        </SegmentedView.Sheet>
      </SegmentedView>
    </BaseContainer>
  );
}
