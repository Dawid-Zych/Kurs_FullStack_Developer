import mysql from "mysql2/promise";
const connection = await mysql.createConnection({ 
    host: "localhost", 
    user: "root", 
    password: "", 
    database: "test"
});

await connection.connect();




async function getUserNames() {
    const sql = "SELECT id, CONCAT_WS(', ', name, surname) AS 'name and surname' FROM users ";
    const [rows] = await connection.query(sql);
    return rows;
}

const users = await getUserNames();
console.log(users);