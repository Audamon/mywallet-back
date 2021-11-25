import connection from '../database.js';

async function signOut(req, res) {
  const { token } = req.body;
  try {
    await connection.query('DELETE FROM sessions WHERE token = $1;', [token]);
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
export { signOut };
