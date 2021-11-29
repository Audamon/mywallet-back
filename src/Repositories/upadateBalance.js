import connection from '../database';

async function updateBalance({user, value}) {
    const balance = user.rows[0].balance + value;
    await connection.query(
        ' UPDATE customers SET balance = $1 WHERE id = $2;',
        [balance, user.rows[0].userId]
      );
}
export { updateBalance }; 