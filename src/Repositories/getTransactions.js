import connection from '../database';

async function getTransactionsDB({token, user}) {
    const transactions = await connection.query(
       `SELECT * FROM sessions JOIN customers ON sessions."userId" = customers.id 
           JOIN transactions ON sessions."userId" = transactions."userId" WHERE sessions.token = $1`,
       [token]
      );
      transactions.rows.forEach((el) => {
          delete el.id;
          delete el.userId;
          delete el.password;
          delete el.token;
        });
        const totalBalance = user.rows[0].balance;
      const transactionsData = {
        transactions: [...transactions.rows],
        totalBalance,
      };
        return transactionsData;
}   
export { getTransactionsDB }; 