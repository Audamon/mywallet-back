import {checkEmail} from '../Repositories/checkEmail.js'
import { createDBUser } from "../Repositories/createUser.js";

async function createUser({password, name, email, balance}){
    const validEmail = await checkEmail({email});
    if(validEmail.rowCount !== 0){
        return null;
    }
    const result = await createDBUser({email, name, password, balance});
    return result.rowCount;
}
export { createUser };