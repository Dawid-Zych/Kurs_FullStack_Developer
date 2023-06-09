/*  
    1. Napisz asynchroniczną funkcję getAllByAge(age) która zwróci użytkowników których wiek
       jest równy przekazanej wartości age
    2. Wywołaj napisaną funkcję i pokaż wynik w konsoli np dla wieku 29
*/

import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
}); 

await connection.connect();

async function getAllByAge(age) {
    const sql = "SELECT * FROM users WHERE age = ?";
    const [rows] = await connection.execute(sql, [age]);

    return rows;
}

const data = await getAllByAge(29);
console.log(data);


 
