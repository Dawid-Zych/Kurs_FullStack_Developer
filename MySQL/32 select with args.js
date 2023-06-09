
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
});


const sql1  = "SELECT * FROM users WHERE name = ? AND age > ? ";

const [rows] = await connection.execute(sql1, ["Ola", 22]);

console.log("num rows:", rows.length); 
console.log("rows: ", rows);
