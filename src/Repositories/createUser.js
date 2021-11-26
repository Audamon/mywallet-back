import bcrypt from "bcrypt";
import connection from "../database.js";

async function createDBUser({email, name, password, balance}){
    const hashedPassword = bcrypt.hashSync(password, 12);
    const result = await connection.query(
        `INSERT INTO customers ("name", "email", "password", balance) VALUES ($1, $2, $3, $4)`,
        [name, email, hashedPassword, balance]
      );
      return result;
}
export { createDBUser };