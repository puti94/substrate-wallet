import {useStoreActions} from 'easy-peasy';

export default function useSendTx(): ({
  section: string,
  method: string,
  args: Array<any>,
  txUpdateCb?: Function,
  txFailedCb?: Function,
  txSuccessCb?: Function,
  txStartCb?: Function,
}) => Promise<{
  address: string,
  meta: {name: string},
} | null> {
  return useStoreActions(actions => actions.accounts.send);
}
