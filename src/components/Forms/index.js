/**
 * User: puti.
 * Time: 2019-12-13 11:01.
 */
import React from 'react';
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
    showSubmitButton = true,
  } = props;
  return (
    <View style={style}>
      {fields.map((t, index) => (
        <FormItem
          key={t.prop}
          handleChange={handleChange(t.prop)}
          onBlur={handleBlur(t.prop)}
          value={values[t.prop]}
          error={errors[t.prop]}
          {...t}
        />
      ))}
      {children}
      {showSubmitButton && (
        <CommonButton onPress={handleSubmit} title={'submit'} />
      )}
    </View>
  );
}
