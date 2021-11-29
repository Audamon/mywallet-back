import connection from '../database';

async function createSession({token, user}) {
    await connection.query(
        'INSERT INTO sessions (token, "userId") VALUES ($1, $2);',
        [token, user.rows[0].id]
      );
}
export { createSession };