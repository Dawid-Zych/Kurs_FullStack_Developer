
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
});

const query = "SELECT * FROM users WHERE age >= 20";

const [rows] = await connection.execute(query);

console.log("num rows:", rows.length);
console.log("rows:", rows);

await connection.end();