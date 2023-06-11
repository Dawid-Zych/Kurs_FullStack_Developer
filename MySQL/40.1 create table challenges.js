/*  
    1. Napisz asynchroniczną funkcję do tworzenia tabeli smartphones, opisz
       następującymi polami telefony:
       id  - int z automatyczną inkremenatcją, unikalny identyfikator
       brand, name, oba jako varchar
       screenSize (int - domyślnie 3), 
       premiere (DATETIME - domyślnie aktualny czas), 
       created (DATETIME - domyślnie aktualny czas), 
       updated (DATETIME - domyślnie aktualny czas)
    2. Stwórz tabelę w bazie z napisaną funkcją 
*/
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'test',
});

await connection.connect();

async function createTable() {
	const sql = `
        CREATE TABLE IF NOT EXISTS smartphones (
            id int NOT NULL AUTO_INCREMENT,
            brand varchar(16) NOT NULL,
            name varchar(24) NOT NULL,
            screenSize int DEFAULT 3,
            storageSize int DEFAULT 2,
            premiere DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(id)
        );
    `;

	await connection.query(sql).catch(err => {
		throw err;
	});
}

await createTable();

await connection.close();
