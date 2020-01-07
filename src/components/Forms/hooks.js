/**
 * User: puti.
 * Time: 2019-12-13 20:15.
 */
import {useFormik} from 'formik';
import type {FieldProps} from './FormItem';
import buildProps from './util/buildProps';
import {TYPE_BALANCE, TYPE_BOOL, TYPE_VOTE} from './types';
import {toBN} from '../../utils/format';

export function buildFields(
  fields: Array<FieldProps>,
  commonProps,
): Array<FieldProps> {
  return fields
    .filter(t => t)
    .map(t => {
      return buildProps(Object.assign(t, commonProps));
    });
}

async function _validate(values, fields: Array<FieldProps>) {
  const errors = {};

  const res = await Promise.all(
    fields.map(async t => {
      const validates = t.validate || [];
      if (t.required) {
        validates.push({
          verify: v => !!v,
          message: t.requiredMessage || '不能为空',
        });
      }
      const message = await verifySingle(validates, values[t.prop], values);
      return {
        prop: t.prop,
        message,
      };
    }),
  );
  res
    .filter(t => t.message)
    .forEach(t => {
      errors[t.prop] = t.message;
    });
  return errors;
}

async function verifySingle(validates, value, values) {
  let errMessage;
  for (let i = 0; i < validates.length; i++) {
    const {verify, message} = validates[i];
    let res;
    try {
      const verifyValue = verify(value, values);
      if (verifyValue instanceof Promise) {
        res = await verifyValue;
      } else {
        res = verifyValue;
      }
    } catch (e) {
      res = false;
    }
    if (!res) {
      errMessage = message;
      return errMessage;
    }
  }
}

export default function useForm({
  fields,
  initialValues = {},
  onSubmit,
  ...params
}) {
  const _fields = [];
  fields.forEach(t => {
    if (t.type === 'form') {
      _fields.push(...t.fields);
    } else {
      _fields.push(t);
    }
  });
  _fields.forEach(
    t => (initialValues[t.prop] = t.value || initialValues[t.prop] || ''),
  );

  const formik = useFormik({
    validateOnBlur: true,
    onSubmit: values => {
      onSubmit(handleSubmitParams(fields, values));
    },
    ...params,
    initialValues,
    validate: values => {
      return _validate(values, _fields);
    },
  });
  formik.fields = fields;
  return formik;
}

function handleSubmitParams(fields: Array<FieldProps>, values) {
  const params = {};
  fields.forEach(t => {
    const value = values[t.prop];
    switch (t.type) {
      case 'form':
        const _params = handleSubmitParams(t.fields, values);
        params[t.prop] = t.fields.map(t => _params[t.prop]);
        break;
      case TYPE_BALANCE:
        params[t.prop] = toBN(value).toString();
        break;
      case TYPE_BOOL:
        params[t.prop] = value === '-1';
        break;
      case TYPE_VOTE:
        params[t.prop] = value === '-1';
        break;
      default:
        params[t.prop] = value;
    }
  });
  return params;
}
