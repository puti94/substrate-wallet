/**
 * User: puti.
 * Time: 2019-12-13 11:01.
 */
import React, {useRef} from 'react';
import {View} from 'react-native';
import CommonButton from '../CommonButton';
import FormItem, {FieldProps} from './FormItem';

export {buildFields} from './hooks';
export {default as useForm} from './hooks';
export * from './types';
type Props = {
  initialValues?: Object,
  fields: Array<FieldProps>,
  showSubmitButton?: boolean,
  autoSubmit?: boolean,
  submitTitle?: string,
  children?: any,
  onSubmit: Function,
};

export function BaseForm(props: Props) {
  const {
    fields = [],
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    style,
    children,
    submitTitle = '提交',
    showSubmitButton = true,
    autoSubmit = true,
    submitForm,
  } = props;
  const inputs = useRef({});
  return (
    <View style={style}>
      {fields.map((t, index) => (
        <FormItem
          key={t.prop}
          ref={ref => (inputs.current[t.prop] = ref)}
          handleChange={handleChange(t.prop)}
          onBlur={handleBlur(t.prop)}
          value={values[t.prop]}
          error={errors[t.prop]}
          returnKeyType={index === fields.length - 1 ? 'done' : 'next'}
          onSubmitEditing={() => {
            if (index !== fields.length - 1) {
              inputs.current[fields[index + 1].prop].focus();
            } else {
              autoSubmit && submitForm();
            }
          }}
          {...t}
        />
      ))}
      {children}
      {showSubmitButton && (
        <CommonButton onPress={handleSubmit} title={submitTitle} />
      )}
    </View>
  );
}
