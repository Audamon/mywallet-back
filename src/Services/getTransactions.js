import { checkToken } from '../Repositories/checkToken.js';
import { getTransactionsDB } from '../Repositories/getTransactions.js';

async function getTransactions({token}) {
    const user = await checkToken({token});
    if (user.rowCount === 0){
        return null;
    }
    const transactions = await getTransactionsDB({token, user});
      return transactions;
}
export { getTransactions };