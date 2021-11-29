import bcrypt from 'bcrypt';
import { signInDB } from '../Repositories/signInUser';
import { v4 as uuid } from 'uuid';
import { createSession } from '../Repositories/createSession';

async function signInUser({email, password}) {
  const user = await signInDB({email});
  if (user.rowCount === 0 || !bcrypt.compareSync(password, user.rows[0].password)) {
      return null;
  }
  const token = uuid();
  await createSession({token, user});
  const obj = {
      token,
      name: user.rows[0].name,
      balance: user.rows[0].balance,
  }
  return obj;
}
export { signInUser };