/**
 * User: puti.
 * Time: 2019-12-11 15:03.
 */
import React, {useEffect, useState} from 'react';
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

function CreateView() {
  const createFields = buildFields([
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
      validate: [
        {
          verify: (value, values) => value === values.password,
          message: '密码不一致',
        },
      ],
    },
  ]);

  const form = useForm({
    fields: createFields,
    onSubmit: values => {
      console.log('提交', values);
    },
  });
  return <BaseForm fields={createFields} {...form} />;
}

function ImportView() {
  const typeItem = {
    label: '类型',
    prop: 'type',
    type: TYPE_SELECT,
    items: [
      {label: 'Keystore', value: 'keystore'},
      {label: '助记词', value: 'mnemonic'},
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
    label: '助记词',
    prop: 'mnemonic',
    type: TYPE_AREA,
    validate: [
      {
        verify: isMnemonic,
        message: '助记词长度正确',
      },
    ],
    required: true,
  };
  const [isKeystoreType, setKeystoreType] = useState(true);
  const fields = buildFields([
    typeItem,
    isKeystoreType ? keystoreItem : mnemonicItem,
    passwordItem,
  ]);
  console.log('表单', fields);
  const form = useForm({
    fields: fields,
    initialValues: {type: 'keystore'},
    onSubmit: values => {
      console.log('提交', values);
    },
  });
  useEffect(() => {
    console.log('值', form.values.type);
    setKeystoreType(form.values.type === 'keystore');
  }, [form.values.type]);
  return <BaseForm fields={fields} {...form} />;
}

export default function AddAccount() {
  return (
    <BaseContainer title={'添加钱包'}>
      <SegmentedView style={{flex: 1}} type="projector">
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
