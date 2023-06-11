/*  
    Zadanie
    1. Skasuj bazę danych telephnes z wykorzystaniem
       funkcji asynchronicznej dropDatabase(name) którą
       musisz napisać
*/

import mysql from 'mysql2/promise';
const connection = await mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
});

await connection.connect();

async function dropDb(name) {
	const sql = 'DROP DATABASE ??';

	await connection.query(sql, [name]).catch(err => {
		throw err;
	});
}

await dropDb('telephones');

await connection.close();
