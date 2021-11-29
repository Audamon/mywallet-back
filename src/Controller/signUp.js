import { signUpSchema } from '../Schemas/schemas.js';
import { createUser } from '../Services/createUser.js';

async function signUp(req, res) {
  const { name, email, password } = req.body;
  const balance = 0;
 const validate = signUpSchema.validate(req.body);
  if (validate.error) {
    return res.sendStatus(400);
  }
  try {
    const user = await createUser({name, email, password, balance});
    if (!user) {
      return res.sendStatus(409);
    }

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
export { signUp };
