import {checkToken} from '../Repositories/checkToken.js';
import { updateBalance } from '../Repositories/upadateBalance.js';
import { createTransactionDB } from '../Repositories/createTransaction.js';

async function createTransaction({token, value, description, type}) {
  const user = await checkToken({token});
  if(user.rowCount === 0) {
      return null;
  }
  await createTransactionDB({description, value, user, type});
  await updateBalance({user, value});
  return user;

}
export { createTransaction };