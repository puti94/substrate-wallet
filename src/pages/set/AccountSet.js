/**
 * User: puti.
 * Time: 2019-12-13 09:30.
 */

import BaseContainer from '../../components/BaseContainer';
import React, {useState} from 'react';
import ListRow from '../../components/ListRow';
import {RouteHelper} from 'react-navigation-easy-helper';
import {showAlert, showTextInput} from '../../utils/dialog';
import keyring from '@polkadot/ui-keyring';
import {useAccounts, useSelectedAccount} from '../../hooks';
import CommonButton from '../../components/CommonButton';
import {withConfirm} from '../../utils';
import {toAddress, toHex} from '../../utils/defaults';
import {useStoreActions} from 'easy-peasy';

export default function AccountSet() {
  const selectedAccount = useSelectedAccount();
  const setSelectedAccount = useStoreActions(
    actions => actions.accounts.setSelectedAccount,
  );
  const accounts = useAccounts();
  const [name, setName] = useState(
    selectedAccount ? selectedAccount.meta.name : '',
  );
  const changeName = async () => {
    const accName = await showTextInput({
      title: '修改钱包名称',
    });
    if (!accName) {
      showAlert('不能为空');
      return;
    }
    const meta = {name: accName, whenEdited: Date.now()};
    keyring.saveAccountMeta(selectedAccount, meta);
    setName(accName);
  };
  const exportKeystore = async () => {
    const password = await showTextInput({
      title: '输入钱包密码',
    });
    if (!password) {
      showAlert('不能为空');
      return;
    }
    
  };
  return (
    <BaseContainer useScrollView title={'钱包管理'}>
      <ListRow title={'修改名称'} onPress={changeName} detail={name} />
      <ListRow
        title={'修改密码'}
        onPress={() => {
          RouteHelper.navigate('ChangePassword');
        }}
      />
      <ListRow title={'导出私钥'} onPress={exportKeystore} />
      <CommonButton
        style={{marginTop: px2dp(150)}}
        onPress={withConfirm({title: '确定删除吗?'})(() => {
          try {
            const address = toAddress(selectedAccount.address);
            const list = accounts
              .map(t => toAddress(t))
              .filter(t => t !== address);
            setSelectedAccount(list[0]);
            keyring.forgetAccount(address);
            RouteHelper.reset('Main');
          } catch (e) {
            console.log('错误', e);
          }
        })}
        title={'删除钱包'}
      />
    </BaseContainer>
  );
}
