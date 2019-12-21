/**
 * User: puti.
 * Time: 2019-12-11 15:03.
 */
import React from 'react';
import BaseContainer from '../../../components/BaseContainer';
import {
  buildFields,
  useForm,
  BaseForm,
  TYPE_ADDRESS,
} from '../../../components/Forms';
import {RouteHelper} from 'react-navigation-easy-helper';
import {useStoreActions} from 'easy-peasy';

export default function AddAddress() {
  const addBook = useStoreActions(actions => actions.set.addBook);
  const form = useForm({
    fields: buildFields([
      {
        label: '钱包地址',
        prop: 'address',
        type: TYPE_ADDRESS,
      },
      {
        label: '钱包名称',
        prop: 'name',
        required: true,
      },
    ]),
    onSubmit: values => {
      addBook(values);
      RouteHelper.goBack();
    },
  });
  return (
    <BaseContainer useScrollView title={'添加地址'}>
      <BaseForm {...form} />
    </BaseContainer>
  );
}
