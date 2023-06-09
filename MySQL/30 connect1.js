
import mysql from "mysql2";

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
});

connection.connect();

connection.query( "SELECT 10 + 2 AS solution", function (err, results, fields) {
    if (err) throw err;
    console.log("Solution is: ", results[0].solution);
});

connection.end();