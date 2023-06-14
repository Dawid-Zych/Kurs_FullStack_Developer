/* 
    Zadanie
    1. Napisz asynchrniczną funkcję getUsersBySurname(...surnamesArr)
       która zwróci osoby na bazie nazwisk przekazanych jako argumenty,
       zastosuj w zapytaniu WHERE IN
    2. Stwórz funkcję getUsersWithoutSurname(...surnamesArr) która
       zwróci osoby których nazwiska nie są jak w przekazanych 
       argumentach, zastosuj WHERE NOT IN
    3. Zastosuj napisane funkcje z nazwiskami: 
       "Kowalska", "Adamski", "Olski"
*/

import mysql from 'mysql2/promise';
const connection = await mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'test',
});
await connection.connect();

async function getUsersBySurname(...surnamesArr) {
	const str = '(' + surnamesArr.map(v => `"${v}"`).join(',') + ')';
	const sql = 'SELECT * FROM users WHERE surname IN ' + str;
	const [rows] = await connection.query(sql);
	return rows;
}
console.log('Users:\n', await getUsersBySurname('Kowalska', 'Adamski', 'Olski'));

async function getUsersWithoutSurname(...surnamesArr) {
	const str = '(' + surnamesArr.map(v => `"${v}"`).join(',') + ')';
	const sql = 'SELECT * FROM users WHERE surname NOT IN ' + str;
	const [rows] = await connection.query(sql);
	return rows;
}
console.log('Users2:\n', await getUsersWithoutSurname('Kowalska', 'Adamski', 'Olski'));

await connection.close();
