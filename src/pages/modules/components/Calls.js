/**
 * User: puti.
 * Time: 2019-12-17 19:40.
 */
import React, {useState} from 'react';
import BaseContainer from '../../../components/BaseContainer';
import {Overlay} from 'teaset';
import {mapInputType} from '../../../utils/convert';
import {
  buildFields,
  useForm,
  BaseForm,
  TYPE_BUTTON,
  TYPE_ADDRESS_WITHACCOUNT,
  TYPE_NUMBER,
} from '../../../components/Forms';
import {SelectView} from '../../../components/DialogViews/SelectView';
import WithCallResult from '../../../components/WithCallResult';
import {useStoreState} from 'easy-peasy';
import {toAddress} from '../../../utils/defaults';
import {useSignTx} from '../../../hooks';
import {toBN} from '../../../utils/format';
import AvailableText from '../../../components/AvailableText';

function buildCustomFields(params) {
  return params.map(t => ({
    tag: 'params',
    label: `${t.isOptional ? '' : '* '}${t.name}:${t.type}`,
    prop: t.name,
    required: !t.isOptional,
    type: mapInputType(t.type),
    // items: t.items
    //   ? buildFields(
    //       t.items.map(t => ({
    //         label: `${t.isOptional ? '' : '* '}${t.name}:${t.type}`,
    //         prop: t.name,
    //         required: !t.isOptional,
    //         type: mapInputType(t.type),
    //       })),
    //     )
    //   : undefined,
  }));
}

export default function Calls({
  options,
  initialModule = 'author',
  type = 'rpc',
  initialCallIndex = 0,
  withSigner,
}) {
  const selectedAddress = useStoreState(
    state => state.accounts.selectedAddress,
  );
  const signTx = useSignTx();
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
      signer: toAddress(selectedAddress),
    },
    fields: buildFields([
      withSigner
        ? {
            prop: 'signer',
            editable: false,
            label: 'Using the selected account',
            type: TYPE_ADDRESS_WITHACCOUNT,
            hint: ({value}) => <AvailableText address={value} />,
          }
        : null,
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
    onSubmit: async values => {
      const args = customFields
        .map(t => {
          if (t.type === 'form') {
            return t.items.map(v => values[t.key][v.key]);
          }
          if (t.type === TYPE_NUMBER) {
            return toBN(values[t.prop]).toString();
          }
          return values[t.prop];
        })
        .filter(t => !!t);
      console.log('参数', values, args);
      if (type === 'tx' && withSigner) {
        const message = await signTx({
          section: values.module,
          method: values.call,
          args: args,
          signer: values.signer,
        });
        if (!message) {
          return;
        }
        setCallList([
          ...callList,
          {
            section: 'rpc',
            module: 'author',
            call: 'submitAndWatchExtrinsic',
            arg: [message],
            time: Date.now(),
          },
        ]);
      } else {
        setCallList([
          ...callList,
          {
            module: values.module,
            call: values.call,
            arg: args,
            time: Date.now(),
          },
        ]);
      }
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
        .map((t, i) => (
          <WithCallResult key={i} section={type} {...t} />
        ))}
    </BaseContainer>
  );
}
