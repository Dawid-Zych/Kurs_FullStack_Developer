/*  
    Zadanie
    1. Stwórz asynchroniczną funkcję getOrderById(id) która pokaże zamówienie
       ze względu na id
    2. Pokaż w konsoli dane zamówienia o id 1
*/
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
}); 
await connection.connect();
  

async function getOrderById(id) {
    const sql = "SELECT * FROM orders where id = ?";
    const [data] = await connection.query(sql, [id]);
    return data.pop();
}

console.log( await getOrderById(1) );

await connection.close();