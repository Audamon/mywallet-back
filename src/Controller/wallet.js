import { getTransactions } from '../Services/getTransactions.js';

async function wallet(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  try {
    // const user = await connection.query(
    //   `SELECT * FROM sessions JOIN customers ON sessions."userId" = customers.id 
    //        WHERE sessions.token = $1`,
    //   [token]
    // );
    // if (user.rowCount === 0) {
    //   return res.sendStatus(401);
    // }
    // const transactions = await connection.query(
    //   `SELECT * FROM sessions JOIN customers ON sessions."userId" = customers.id 
    //       JOIN transactions ON sessions."userId" = transactions."userId" WHERE sessions.token = $1`,
    //   [token]
    // );
    // transactions.rows.forEach((el) => {
    //   delete el.id;
    //   delete el.userId;
    //   delete el.password;
    //   delete el.token;
    // });
    // const totalBalance = user.rows[0].balance;
    // const transactionsData = {
    //   transactions: [...transactions.rows],
    //   totalBalance,
    // };
    
    const transactionsData = await getTransactions({token});
    if (!transactionsData){
      return res.sendStatus(401);
    }
    return res.status(200).send(transactionsData);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
export { wallet };
