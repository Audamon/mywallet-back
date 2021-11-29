import { signInSchema } from '../Schemas/schemas.js';
import { signInUser } from '../Services/singInUser.js';

async function signIn(req, res) {
  const { email, password } = req.body;
  const validate = signInSchema.validate(req.body);
  if (validate.error) {
    return res.sendStatus(400);
  }
  try {
    const user = await signInUser({email, password});
    if (!user) {
      return res.sendStatus(401);
    }
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
export { signIn };
