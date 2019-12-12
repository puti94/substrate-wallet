/**
 * User: puti.
 * Time: 2019/12/11 4:51 PM.
 */

import React from 'react';
import {Text, Clipboard} from 'react-native';
import {ActionPopover, Toast} from 'teaset';
import Icon from './Icon';

const CopyText = ({
  showItem = false,
  iconColor,
  showCopyIcon,
  needCopy = true,
  children,
  ...otherProps
}: Props) => {
  const _setText = () => {
    Clipboard.setString(children);
    Toast.success(i18n('Base.CopySuccess'));
  };
  if (showItem) {
    otherProps.onLongPress = () => {
      this.text.measureInWindow((x, y, width, height) => {
        ActionPopover.show({x, y, width, height}, [
          {
            title: i18n('Base.Copy'),
            onPress: _setText,
          },
        ]);
      });
    };
  } else if (needCopy) {
    otherProps.onPress = _setText;
  }
  return (
    <Text ref={ref => (this.text = ref)} {...otherProps}>
      {children}
      {!!showCopyIcon && (
        <>
          <Text>{'   '}</Text>
          <Icon onPress={_setText} icon={'copy1'} size={18} color={iconColor} />
        </>
      )}
    </Text>
  );
};
export type Props = {
  showItem?: boolean,
  needCopy?: boolean,
  showCopyIcon?: boolean,
  iconColor?: string,
};

CopyText.defaultProps = {
  iconColor: 'white',
};
export default CopyText;
