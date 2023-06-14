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

async function getUsers1(prefix) {
	const str = prefix + '%'; // "A%"
	const sql = 'SELECT * FROM users WHERE name LIKE ? ';
	const [rows] = await connection.query(sql, [str]);
	return rows;
}
showUsers("Users with name starting with 'K':", await getUsers1('K'));

async function getUsers2(suffix) {
	const str = '%' + suffix; //  "%a"
	const sql = 'SELECT * FROM users WHERE name LIKE ? ';
	const [rows] = await connection.query(sql, [str]);
	return rows;
}
showUsers("Users with name ending with 'l':", await getUsers2('l'));

async function getUsers3(str) {
	const str2 = '%' + str + '%'; // "%a%"
	const sql = 'SELECT * FROM users WHERE name LIKE ? ';
	const [rows] = await connection.query(sql, [str2]);
	return rows;
}
showUsers("Users with 'a' inside name:", await getUsers3('a'));

async function getUsers4(thirdLetter) {
	const str2 = '__' + thirdLetter + '%'; // "__a%"
	const sql = 'SELECT * FROM users WHERE name LIKE ? ';
	const [rows] = await connection.query(sql, [str2]);
	return rows;
}
showUsers("Users with third letter 'a':", await getUsers4('a'));

async function getUsers5(firstletter) {
	const str = firstletter + '___%'; // "Z___%"
	const sql = 'SELECT * FROM users WHERE name LIKE ? ';
	const [rows] = await connection.query(sql, [str]);
	return rows;
}
showUsers("Users with surname starting with 'Z' min 4 length:", await getUsers5('Z'));

await connection.close();
