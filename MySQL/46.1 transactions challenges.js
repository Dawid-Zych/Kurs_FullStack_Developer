/*  
   Zadanie
   1. Napisz funkcję createTable() która utworzy tabelę countries jeżeli ta tabela nie istnieje
      z następującymi polami: 
      id - unikalny identyfikator auto increment
      name, continent - varchar
      population - liczba całkowita
      created, updated - DATETIME
    2. Stwórz funkcję insert(country) która zapisze rekord do countries, pamiętaj aby zwrócić
       obiekt country z uzyskanym id z bazy danych
    3. Napisz funkcję getAllCountries() do pobrania krajów z bazy
    4. Korzystając z transakcji wywołaj funkcję tworzącą bazę danych countries i dodaj dwa
       rekordy dla Polski (37mln) i Hiszpanii (47mln)
*/
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'test',
});

await connection.connect();

// Transakcje pozwalają na zabezpieczenie się przed wprowadzeniem niekompletnych
// danych do bazy. Jeśli po drodze pojawi się błąd przy pracy z bazą to można wywołać
// rollback() aby cofnąć wcześniej wprowadzone zmiany.

async function createTable() {
	const sql = `
    CREATE TABLE IF NOT EXISTS countries (
        id int NOT NULL AUTO_INCREMENT,
        name varchar(24) NOT NULL,
        continent varchar(12) NOT NULL,
        population int DEFAULT NULL,
        created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id)
    );`;

	await connection.query(sql).catch(err => {
		throw err;
	});
}

async function insert(country) {
	const sql = `INSERT INTO countries (name, continent, population) VALUES (?, ?, ?)`;
	const [result] = await connection.query(sql, [country.name, country.continent, country.population]);
	return { ...country, id: result.insertId };
}

async function getAllCountries() {
	const sql = 'SELECT * FROM countries';
	const [rows] = await connection.query(sql);
	return rows;
}

try {
	await connection.beginTransaction();

	await createTable();
	const country1 = await insert({
		name: 'Polska',
		continent: 'Europa',
		population: 37000000,
	});

	const country2 = await insert({
		name: 'Hiszpania',
		continent: 'Europa',
		population: 47000000,
	});

	const data = await getAllCountries();
	console.log(data);

	await connection.commit();
} catch (err) {
	await connection.rollback();
	console.log('error, rollback, ', err);
} finally {
	await connection.close();
}
