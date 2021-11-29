import connection from '../database';

async function createTransactionDB({description, value, user, type}) {
    const date = new Date();
    const dayMonth = `${date.getDate()}/${date.getMonth() + 1}`;
    await connection.query(
      `
            INSERT INTO transactions (description, value, "userId", "operationOut", date) VALUES ($1, $2, $3, $4, $5); 
           
          `,
      [description, value, user.rows[0].userId, type, dayMonth.toString()]
    );
}
export { createTransactionDB }