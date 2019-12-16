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
  getItems(items: Items) {
    return items.map(t => (typeof t === 'string' ? t : t.label));
  }

  getIndex(items: Items, value: string) {
    return items.findIndex(
      t => (typeof t === 'string' ? t : t.value) === value,
    );
  }

  getLabelValue(items: Items, label) {
    return items[
      items.findIndex(
        item => (typeof item === 'string' ? item : item.label) === label,
      )
    ].value;
  }

  getValueLabel(items: Items, value) {
    return items[
      items.findIndex(
        item => (typeof item === 'string' ? item : item.value) === value,
      )
    ].label;
  }

  getShowValue(value) {
    if (!value) {
      return null;
    }
    const {items} = this.props;
    return this.getValueLabel(items, value);
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
          onChangeText && onChangeText(this.getLabelValue(items, item));
          resolve();
        },
      );
    });
  }
}
