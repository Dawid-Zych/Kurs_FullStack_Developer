/*
    Sequelize to ORM - Object Relational Mapping w Node.js dla baz PostgreSQL, MySQL, 
    MSSQL, SQLite. ORM to odwzorowanie obiektowej architektury systemu informatycznego
    na bazę danych mającą relacyjny charakter. W praktyce oznacza zamianę danych 
    w postaci tabelarycznej na obiekty i w drugą stronę.

    npm install mysql2 sequelize
    w package.json type jako module
*/

import { Sequelize } from 'sequelize';

// podajemy nazwe bazy danych, naszego uzytkownika, hasło, obiekt różnych dodatkowych danych
const sequelize = new Sequelize('test', 'root', '', {
	host: 'localhost',
	dialect: 'mysql',
});

try {
	await sequelize.authenticate();
	console.log('Connected to database.');

	await sequelize.close();
} catch (error) {
	console.error('Unable to connect to database:', error);
}
