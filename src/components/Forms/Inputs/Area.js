/**
 * User: puti.
 * Time: 2019-12-13 14:17.
 */
import Input from './Input';

export default class Area extends Input {
  buildProps(props) {
    return {
      numberOfLines: 4,
      textAlignVertical: 'top',
      multiline: true,
      ...props,
    };
  }
}
