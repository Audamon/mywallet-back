import connection from '../database.js';

async function transactionOut(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const { value, description } = req.body;
  const date = new Date();
  const dayMonth = `${date.getDate()}/${date.getMonth() + 1}`;
  try {
    const user = await connection.query(
      `SELECT * FROM sessions JOIN customers ON sessions."userId" = customers.id 
          WHERE sessions.token = $1`,
      [token]
    );
    if (user.rowCount === 0) {
      return res.sendStatus(401);
    }
    const balance = user.rows[0].balance - value;
    await connection.query(
      `
            INSERT INTO transactions (description, value, "userId", "operationOut", date) VALUES ($1, $2, $3, $4, $5); 
          `,
      [description, value, user.rows[0].userId, true, dayMonth.toString()]
    );
    await connection.query(
      ' UPDATE customers SET balance = $1 WHERE id = $2;',
      [balance, user.rows[0].userId]
    );
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
export { transactionOut };
