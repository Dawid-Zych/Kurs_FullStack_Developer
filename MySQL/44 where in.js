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

async function getUsersByName(...namesArr) {
	const str = '(' + namesArr.map(v => `"${v}"`).join(',') + ')'; // ("Ola", "Ania", "Kasia")
	const sql = 'SELECT * FROM users WHERE name IN ' + str;
	const [rows] = await connection.query(sql);
	return rows;
}

const users1 = await getUsersByName('Zuza', 'Zuzanna', 'Ola');
showUsers('Users1: ', users1);

async function getUsersWithoutName(...namesArr) {
	const str = '(' + namesArr.map(v => `"${v}"`).join(',') + ')'; // ("Ola", "Ania", "Kasia")
	const sql = 'SELECT * FROM users WHERE name NOT IN ' + str;
	const [rows] = await connection.query(sql);
	return rows;
}

const users2 = await getUsersWithoutName('Zuza', 'Zuzanna', 'Ola');
showUsers('Users2: ', users2);
