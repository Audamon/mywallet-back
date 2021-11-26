import bcrypt from 'bcrypt';
import connection from '../database.js';
import { signUpSchema } from '../Schemas/schemas.js';

async function signUp(req, res) {
  const { username, email, password } = req.body;
  const balance = 0;
 const validate = signUpSchema.validate(req.body);
  if (validate.error) {
    return res.sendStatus(400);
  }
  try {
    const hash = bcrypt.hashSync(password, 12);
    const validEmail = await connection.query(
      'SELECT * FROM customers WHERE email = $1',
      [email]
    );
    if (validEmail.rowCount !== 0) {
      return res.sendStatus(409);
    }
    await connection.query(
      `
              INSERT INTO customers (name, email, password, balance) VALUES ($1, $2, $3, $4);   
          `,
      [username, email, hash, balance]
    );
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
export { signUp };
