/**
 * User: puti.
 * Time: 2019-12-17 19:40.
 */
import React, {useState} from 'react';
import BaseContainer from '../../../components/BaseContainer';
import {Overlay} from 'teaset';
import {
  mapInputType,
} from '../../../utils/convert';
import {
  buildFields,
  useForm,
  BaseForm,
  TYPE_BUTTON,
} from '../../../components/Forms';
import {SelectView} from '../../../components/DialogViews/SelectView';
import WithCallResult from '../../../components/WithCallResult';

function buildCustomFields(params) {
  return params.map(t => ({
    tag: 'params',
    label: `${t.isOptional ? '' : '* '}${t.name}:${t.type}`,
    prop: t.name,
    required: !t.isOptional,
    type: mapInputType(t.type),
    items: t.items
      ? buildFields(
          t.items.map(t => ({
            label: `${t.isOptional ? '' : '* '}${t.name}:${t.type}`,
            prop: t.name,
            required: !t.isOptional,
            type: mapInputType(t.type),
          })),
        )
      : undefined,
  }));
}

export default function Calls({
  options,
  initialModule = 'author',
  type = 'rpc',
  initialCallIndex = 0,
}) {
  const [customFields, setCustomFields] = useState(
    buildCustomFields(options[initialModule][initialCallIndex].params),
  );
  const [callList, setCallList] = useState([]);

  const setParams = params => {
    setCustomFields(buildCustomFields(params));
  };

  const form = useForm({
    initialValues: {
      module: initialModule,
      call: options[initialModule][initialCallIndex].value,
    },
    fields: buildFields([
      {
        prop: 'module',
        label: '选择模块',
        type: TYPE_BUTTON,
        onPress: () => {
          const key = Overlay.show(
            <SelectView
              title="选择模块"
              onSelected={item => {
                if (form.values.module === item) {
                  Overlay.hide(key);
                  return;
                }
                form.setFieldValue('module', item);
                let option = options[item][0];
                form.setFieldValue('call', option.value);
                setParams(option.params);
                Overlay.hide(key);
              }}
              index={Object.keys(options).findIndex(
                t => t === form.values.module,
              )}
              items={Object.keys(options)}
              onClose={() => Overlay.hide(key)}
            />,
          );
        },
      },
      {
        prop: 'call',
        label: '选择方法',
        formatValue: value => {
          const _options = options[form.values.module || initialModule];
          const option = _options[_options.findIndex(t => t.value === value)];
          return `${option.value}(${option.params
            .map(({name}) => name)
            .join(',')})`;
        },
        type: TYPE_BUTTON,
        onPress: () => {
          const key = Overlay.show(
            <SelectView
              title="选择方法"
              onSelected={item => {
                if (form.values.call === item.value) {
                  Overlay.hide(key);
                  return;
                }
                form.setFieldValue('call', item.value);
                setParams(item.params);
                Overlay.hide(key);
              }}
              index={options[form.values.module].findIndex(
                t => t.value === form.values.call,
              )}
              getItemText={({value}) => value}
              getItemDetail={({value, description}) => description || value}
              items={options[form.values.module]}
              onClose={() => Overlay.hide(key)}
            />,
          );
        },
      },
      ...customFields,
    ]),
    onSubmit: values => {
      console.log('参数', values);
      const args = customFields
        .map(t => {
          if (t.type === 'form') {
            return t.items.map(v => values[t.key][v.key]);
          }
          return values[t.prop];
        })
        .filter(t => !!t);
      console.log('参数', values, args);
      setCallList([
        ...callList,
        {
          module: values.module,
          call: values.call,
          arg: args,
          time: Date.now(),
        },
      ]);
    },
  });
  return (
    <BaseContainer useScrollView navBar={null} title={'Toolbox'}>
      <BaseForm {...form} fields={form.fields.filter(t => t.tag !== 'params')}>
        <BaseForm
          style={{marginLeft: px2dp(40)}}
          showSubmitButton={false}
          {...form}
          fields={form.fields.filter(t => t.tag === 'params')}
        />
      </BaseForm>
      {callList
        .slice()
        .sort((a, b) => b.time - a.time)
        .map(t => (
          <WithCallResult section={type} {...t} />
        ))}
    </BaseContainer>
  );
}
