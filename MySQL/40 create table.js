import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'test_db',
});

await connection.connect();

async function createTable() {
	const sql = `
        CREATE TABLE IF NOT EXISTS customers (
            id int NOT NULL AUTO_INCREMENT,
            name varchar(16) NOT NULL,
            surname varchar(16) DEFAULT NULL,
            occupation varchar(24) DEFAULT NULL,
            age int DEFAULT 18,
            created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated DATETIME ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY(id) /* id unikalny identyfikator/wartość */
        );
    `;

	await connection.query(sql).catch(err => {
		console.log(err);
	});
}

await createTable();

console.log('Table created');
