import connection from '../database.js';
import { createTransaction } from '../Services/createTransaction.js';

async function transactionOut(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const { value, description } = req.body;
  const type = true;
  try {
    const user =  await createTransaction({token, value, description, type});
    if (!user) {
      return res.sendStatus(401);
    }
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
export { transactionOut };
