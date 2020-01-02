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
  TYPE_AREA,
} from '../../components/Forms';
import {useStoreActions} from 'easy-peasy';
import {checkNodeConnect} from '../../utils/base';
import {Toast} from 'teaset';
import {showLoading} from '../../utils/dialog';
import {RouteHelper} from 'react-navigation-easy-helper';

export default function AddNode() {
  const addNode = useStoreActions(actions => actions.set.addNode);
  const form = useForm({
    initialValues: {types: '{\r\r}'},
    fields: buildFields([
      {
        label: '节点',
        prop: 'node',
        required: true,
      },
      {
        label: '自定义类型',
        prop: 'types',
        validate: [
          {
            verify: v => {
              try {
                JSON.parse(v);
                return true;
              } catch (e) {
                return false;
              }
            },
            message: 'This is not a valid JSON object.',
          },
        ],
        type: TYPE_AREA,
      },
    ]),
    onSubmit: async ({types, node}) => {
      const hide = showLoading('check connect');
      try {
        await checkNodeConnect(node, JSON.parse(types));
        addNode({types, node});
        RouteHelper.goBack();
      } catch (e) {
        Toast.fail('Connect fail:' + e.message);
      }
      hide();
    },
  });
  return (
    <BaseContainer useScrollView title={'添加节点'}>
      <BaseForm {...form} submitTitle={'Save'} />
    </BaseContainer>
  );
}
