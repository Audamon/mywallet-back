import { logOutDB } from '../Repositories/logOutUser.js';

async function logOutUser({token}){
    await logOutDB({token});
}
export { logOutUser };