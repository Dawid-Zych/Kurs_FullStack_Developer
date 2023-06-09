/*  
   Zadanie
   1. Połacz się z bazą danych test 
   2. Pobierz i wyświetl wszystkich users których id jest większe równe od 2 
      oraz age większe od 20 i mniejsze od 75
*/

import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
});


const sql = "SELECT * FROM users WHERE id >= ? AND age > ? AND age < ?";

const [rows] = await connection.execute(sql, [2, 20, 75]);

console.log("Num rows:", rows.length);
console.log(rows);

await connection.close();




