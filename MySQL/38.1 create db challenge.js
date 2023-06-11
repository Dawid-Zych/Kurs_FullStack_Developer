/*  
   Stwórz funkcję która pozwoli na utworzenie bazy ze względu 
   na przekazany name, dodaj do zapytania sql "IF NOT EXISTS"
   dzięki czemu baza powstanie jeśli jeszcze nie istnieje
*/

import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
});

await connection.connect();

async function createDb(name) {
	const sql = 'CREATE DATABASE IF NOT EXISTS ??';

	await connection.query(sql, [name]).catch(err => {
		throw err;
	});
}

await createDb('telephones');

await connection.close();
