import connection from '../database';

async function signInDB({email}) {
    const user = await connection.query('select * from customers where email = $1', [email]);
    return user;
}
export { signInDB };