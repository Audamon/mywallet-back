import connection from '../database';

async function checkToken({token}) {
    const user = await connection.query(
        `SELECT * FROM sessions JOIN customers ON sessions."userId" = customers.id WHERE sessions.token = $1`,
        [token]
      );
      return user;
}
export { checkToken };