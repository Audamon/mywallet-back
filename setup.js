import dotenv from 'dotenv';

const path = process.env.NODE_ENV === 'production' ? '.env' : process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.test';

dotenv.config({ path });