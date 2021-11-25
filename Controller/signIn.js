import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import connection from '../database.js';

async function signIn(req, res) {
  const { email, password } = req.body;

  try {
    const user = await connection.query(
      `
              SELECT * FROM customers WHERE email=$1;
          `,
      [email]
    );
    const hash = bcrypt.compareSync(password, user.rows[0].password);
    if (!hash) {
      return res.sendStatus(401);
    }

    const token = uuid();
    await connection.query(
      'INSERT INTO sessions (token, "userId") VALUES ($1, $2);',
      [token, user.rows[0].id]
    );
    return res.status(200).send({
      token,
      name: user.rows[0].name,
      balance: user.rows[0].balance,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
export { signIn };
