import connection from '../database';

async function logOutDB ({token}){
    await connection.query('DELETE FROM sessions WHERE token = $1;', [token]);

}
export { logOutDB };