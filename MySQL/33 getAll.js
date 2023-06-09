
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
});


await connection.connect();

async function getAll() {
    const query = "SELECT * FROM users";
    const [data] = await connection.query(query);
    return data;
}

const data = await getAll();
console.log("data:", data);
