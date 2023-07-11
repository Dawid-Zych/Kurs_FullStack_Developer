/*
    Sequelize 
    Zadanie:
    1. Połącz się z bazą mysql test 
    2. Stwórz model opisujący osobę z modelem Person, dodaj pola:
       - id - INTEGER, AUTO INCREMENT, PRIMARY KEY
       - name - STRING
       - surname - STRING
       - email - STRING
       - age - INTEGER, domyślna wartość 18
       Nie dodawaj created i updated bo będą dodane automatycznie
    3. Stwórz dwie osoby i zapisz je w bazie, sprawdź utworzoną tabelę i rekordy
       w phpmyadmin. Uwaga Sequelize używa biblioteki inflection która na podstawie
       nazwy Person prawidłowo stworzy tabelę people
*/

import { DataTypes, Sequelize } from 'sequelize';
const sequelize = new Sequelize('test', 'root', '', {
	dialect: 'mysql',
});
try {
	await sequelize.authenticate();
	console.log('Pomyślnie połączono z bazą danych');
} catch (error) {
	console.log('Błąd podczas łączenia z bazą danych', error);
}

const Person = sequelize.define('Person', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},

	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},

	surname: {
		type: DataTypes.STRING,
		allowNull: false,
	},

	email: {
		type: DataTypes.STRING,
		allowNull: false,
	},

	age: {
		type: DataTypes.INTEGER,
		defaultValue: 18,
		allowNull: true,
	},
});

// sync -zsynchronizuj wszystkie zdefiniowane modele z bazą danych.
/* sprawdzamy czy mamy nasza bazę danych */
await sequelize
	.sync()
	.then(() => {
		console.log('Animal table created');
	})
	.catch(error => {
		console.log('Error when creating table: ', error);
	});

await Person.create({
	name: 'Ola',
	surname: 'Kowalska',
	email: 'ola.kowalska@gmail.com',
});

await Person.create({
	name: 'Adam',
	surname: 'Adamski',
	email: 'adam.adamski@gmail.com',
	age: 24,
});

await sequelize.close(console.log('Zamknięto bazę danych'));
