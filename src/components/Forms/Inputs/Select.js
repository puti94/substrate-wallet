/**
 * User: puti.
 * Time: 2019-12-13 14:17.
 */

import {Keyboard} from 'react-native';
import {PullPicker} from 'teaset';
import Button, {Props as ButtonProps} from './Button';

let key;
type Items = Array<string | {label: string, value: string}>;
export type Props = {
  items: Items,
  title?: string,
} & ButtonProps;
export default class Select extends Button<Props> {
  getItems(items: Items = []) {
    return items.map(t => (typeof t === 'string' ? t : t.label));
  }

  getIndex(items: Items = [], value: string) {
    return items.findIndex(
      t => (typeof t === 'string' ? t : t.value) === value,
    );
  }

  getLabelValue(items: Items = [], label) {
    let item =
      items[
        items.findIndex(
          item => (typeof item === 'string' ? item : item.label) === label,
        )
      ];
    return typeof item === 'string' ? item : item.value;
  }

  getValueLabel(items: Items = [], value) {
    let item =
      items[
        items.findIndex(t => (typeof t === 'string' ? t : t.value) === value)
      ];
    return typeof item === 'string' ? item : item.label;
  }

  getShowValue(value) {
    if (!value) {
      return null;
    }
    const {items} = this.props;
    let valueLabel = this.getValueLabel(items, value);
    console.log('valueLabel', valueLabel);
    return valueLabel;
  }

  handleClick() {
    Keyboard.dismiss();
    const {title = '请选择', items, onChangeText, value} = this.props;
    return new Promise(resolve => {
      key && PullPicker.hide(key);
      key = PullPicker.show(
        title,
        this.getItems(items),
        this.getIndex(items, value),
        item => {
          key = null;
          let labelValue = this.getLabelValue(items, item);
          console.log('labelValue', labelValue);
          onChangeText && onChangeText(labelValue);
          resolve();
        },
      );
    });
  }
}
