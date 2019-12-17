/**
 * User: puti.
 * Time: 2019-12-13 20:15.
 */
import {useFormik} from 'formik';
import type {FieldProps} from './FormItem';
import buildProps from './util/buildProps';

export function buildFields(
  fields: Array<FieldProps>,
  commonProps,
): Array<FieldProps> {
  return fields.map(t => {
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
  fields.forEach(t => (initialValues[t.prop] = initialValues[t.prop] || ''));
  let formik = useFormik({
    validateOnBlur: true,
    onSubmit,
    ...params,
    initialValues,
    validate: values => {
      return _validate(values, fields);
    },
  });
  formik.fields = fields;
  return formik;
}
