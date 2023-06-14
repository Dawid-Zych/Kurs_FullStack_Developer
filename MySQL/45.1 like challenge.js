/*   
    Zadanie z LIKE
    1. Zrób funkcję asynchroniczną getUsersBySurnamePrefix(prefix)
       która zwróci userów ze względu na prefix nazwiska, wyświetl
       dane z bazy dla nazwisk zaczynających się na literę "K"
    2. Zapisz asynchrniczną funkcję getUsersBySurnameSuffix(suffix)
       zwracającą userów z nazwiskiem kończącym się na literę "i"
    3. Napisz funkcję asynchroniczną getUsersBySurnameWithStr(str)
       która zwróci userów z tekstem będącym wewnątrz nazwiska,
       wyświetl osoby z tekstem w nazwisku "uz"
    4. Zrób funkcję getUsersBySurnameWithSecondLetter(secondLetter)
       wyświetlającą userów z nazwiskami z drugą literą podaną jako
       parametr funkcji. Wywołaj ją z argumentem "a" i wyświetl
       wynik w konsoli.
    5. Napisz funkcję getUsersBySurnamePrefixMin4Len(prefix) 
       która zwróci osoby z nazwiskiem zaczynającym się na prefix
       z minimalną ilością 4 znaków. Wyświetl wyniki w konsoli.
*/

import mysql from 'mysql2/promise';
const connection = await mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'test',
});
await connection.connect();

function showUsers(info, dbRows) {
	console.log(info);

	dbRows.forEach(r => {
		console.log(r.id, r.name, r.surname, r.bio, r.address, r.age, r.created);
	});
}

async function getUsersBySurnamePrefix(prefix) {
	const str = prefix + '%';
	const sql = 'SELECT * FROM users WHERE surname LIKE ? ';
	const [rows] = await connection.query(sql, [str]);
	return rows;
}
showUsers("Users with surname starting with 'K':", await getUsersBySurnamePrefix('K'));

async function getUsersBySurnameSuffix(suffix) {
	const str = '%' + suffix;
	const sql = 'SELECT * FROM users WHERE surname LIKE ? ';
	const [rows] = await connection.query(sql, [str]);
	return rows;
}
showUsers("Users with surname ending with 'i':", await getUsersBySurnameSuffix('Ki'));

async function getUsersBySurnameWithStr(str) {
	const str2 = '%' + str + '%';
	const sql = 'SELECT * FROM users WHERE surname LIKE ? ';
	const [rows] = await connection.query(sql, [str2]);
	return rows;
}
showUsers("Users with surname ending with 'uz':", await getUsersBySurnameWithStr('uz'));

async function getUsersBySurnameWithSecondLetter(secondLetter) {
	const str2 = '_' + secondLetter + '%';
	const sql = 'SELECT * FROM users WHERE surname LIKE ? ';
	const [rows] = await connection.query(sql, [str2]);
	return rows;
}
showUsers("Users with surname and 'a' as second letter:", await getUsersBySurnameWithSecondLetter('a'));

async function getUsersBySurnamePrefixMin4Len(prefix) {
	const str = prefix + '___%';
	const sql = 'SELECT * FROM users WHERE surname LIKE ? ';
	const [rows] = await connection.query(sql, [str]);
	return rows;
}
showUsers("Users with surname starting with 'Z' min 4 length:", await getUsersBySurnamePrefixMin4Len('Z'));

await connection.close();
