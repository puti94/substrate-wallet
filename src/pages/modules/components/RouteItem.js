/**
 * User: puti.
 * Time: 2019-12-17 19:40.
 */
import React from 'react';
import ListRow from '../../../components/ListRow';
import {RouteHelper} from 'react-navigation-easy-helper';
import {useFoundApis, useSelectedAccount} from '../../../hooks';
import {showAlert} from '../../../utils/dialog';

export default function RouteItem({
  title,
  icon,
  routeName,
  needApis = [],
  needsAccounts = false,
}) {
  const isFound = useFoundApis(needApis);
  const account = useSelectedAccount();
  if (!isFound || (needsAccounts && !account)) {
    return null;
  }
  return (
    <ListRow
      icon={icon}
      title={title}
      onPress={() => {
        if (!routeName) {
          showAlert('TODO');
          return;
        }
        RouteHelper.navigate(routeName);
      }}
    />
  );
}
