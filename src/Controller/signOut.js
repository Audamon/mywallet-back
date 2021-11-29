import { logOutUser } from '../Services/logOutUser.js';

async function signOut(req, res) {
  const { token } = req.body;
  try {
    await logOutUser({token})
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
export { signOut };
