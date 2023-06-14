/*  
    Zadanie:
    1. Napisz funkcję która połączy id, name, surname, bio
       użytkownika z CONCAT_WS(), wywołaj ją i pokaż wynik 
       w konsoli.
*/
import mysql from 'mysql2/promise';
const connection = await mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'test',
});

await connection.connect();

async function getUserData() {
	const sql = "SELECT id, CONCAT_WS(', ', id, name, surname, bio) as 'userData' FROM users ";
	const [rows] = await connection.query(sql);
	return rows;
}

console.log(await getUserData());

await connection.close();
