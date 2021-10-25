import supertest from 'supertest';
import connection from '../database.js';
import server from '../server.js';

describe('POST /signup', ()=>{
     afterAll(async()=>{
         await connection.query('DELETE FROM customers;');
     })
    it('return 200 for valid data', async()=>{
        const body={
            name: 'Alfredo',
            email: 'j@g.com',
            password: 'Aa123456@' 
        }
        const result = await supertest(server).post('/signup').send(body);
        const status = result.status
        expect(status).toEqual(200)
    })

    it('return 409 for email already exist', async()=>{
        const body={
            name: 'Alfredo',
            email: 'j@g.com',
            password: '@Aa123456' 
        }
        const result = await supertest(server).post('/signup').send(body);
        const status = result.status
        expect(status).toEqual(409)
    })

})
