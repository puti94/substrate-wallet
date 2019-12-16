/**
 * User: puti.
 * Time: 2019-12-11 15:03.
 */
import React, {useState, useEffect} from 'react';
import BaseContainer from '../components/BaseContainer';
import {buildFields, useForm, BaseForm} from '../components/Forms';

const forms = buildFields([
  {
    prop: 'amount',
    type: 'number',
    label: '金额',
    hint: '还好',
  },
  {
    prop: 'key',
    type: 'area',
    label: '私钥',
  },
  {
    prop: 'email',
    label: '邮箱',
    placeholder: '请输入邮箱',
  },
  {
    prop: 'selected',
    type: 'select',
    label: '选择',
    placeholder: '请输入邮箱',
    items: ['选择'],
  },
  {
    prop: 'name',
    label: '金额',
    type: 'button',
    onPress: (value, onChangeText) => {
      setTimeout(() => {
        onChangeText('设置');
      }, 1000);
    },
  },
]);

export function Launch() {
  const [fields, setFields] = useState(forms);
  const form = useForm({
    fields: fields,
    onSubmit: values => {
      console.log('提交', values);
    },
  });
  useEffect(() => {
    const name = form.values.key;
    console.log('值', name);
  }, [form.values.key]);
  return (
    <BaseContainer
      title={'测试'}
      rightTitle={'添加'}
      rightPress={() => {
        setFields([
          ...fields,
          ...buildFields([
            {label: '动态添加', prop: 'custom', required: true, subForm: true},
          ]),
        ]);
      }}>
      <BaseForm fields={fields.filter(t => !t.subForm)} {...form}>
        <BaseForm
          showSubmitButton={false}
          style={{marginLeft: px2dp(40)}}
          fields={fields.filter(t => t.subForm)}
          {...form}
        />
      </BaseForm>
    </BaseContainer>
  );
}
