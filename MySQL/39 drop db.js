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
		console.log(err);
	});
}

await dropDb('test_db');
