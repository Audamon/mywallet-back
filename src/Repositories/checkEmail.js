import connection from '../database.js';

async function checkEmail({ email }) {
  const validEmail = await connection.query(
    'SELECT * FROM customers WHERE email = $1',
    [email]
  );
  return validEmail;
}
export {checkEmail};