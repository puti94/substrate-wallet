import {useStoreActions} from 'easy-peasy';

export default function useSignTx(): ({
  section: string,
  method: string,
  signer?: string,
  args: Array<any>,
}) => Promise<string | boolean> {
  return useStoreActions(actions => actions.accounts.sign);
}
