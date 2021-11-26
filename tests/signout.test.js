import supertest from 'supertest';
import bcrypt from 'bcrypt';
import '../setup.js';
import connection from '../database.js';
import server from '../server.js';
import { v4 as uuid } from 'uuid';
import { validBodyFactorySignup } from '../Factories/factories.js';

const token = uuid();
beforeAll(async () =>  {
    const validBody = validBodyFactorySignup();
    const password1 = bcrypt.hashSync(validBody.password, 10)
    await connection.query('insert into customers(name, email, password, balance) values($1, $2, $3, 0)', [validBody.name, validBody.email, password1]);
    const user = await connection.query(`SELECT * FROM customers WHERE email=$1;`,[validBody.email]);
    await connection.query('insert into sessions (token, "userId") VALUES ($1, $2)', [token, user.rows[0].id]);
});
afterAll(async () => {
    await connection.query('delete from customers');
});
describe('DELETE /sigout', () => {
    test('return 200 ', async () => {
        const result = await supertest(server).post('/signout').send({token});
        expect(result.status).toEqual(200);
    });
});