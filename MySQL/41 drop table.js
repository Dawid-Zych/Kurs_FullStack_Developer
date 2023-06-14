import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'test_db',
});

await connection.connect();

async function dropTable(name) {
	const sql = 'DROP TABLE ??';

	await connection.query(sql, [name]).catch(err => {
		console.log(err);
	});
}

await dropTable('customers');
console.log('Table deleted');
