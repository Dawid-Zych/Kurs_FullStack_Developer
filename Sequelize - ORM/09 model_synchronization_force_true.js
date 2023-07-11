/*  
    Czasem nasz model w programie może się zmienić, Sequelize dostarcza różne możliwości
    aktualizacji modelu oraz bazy danych.
*/

import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize('test', 'root', '', {
	host: 'localhost',
	dialect: 'mysql',
	decimalNumbers: true,
});

sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch(error => {
		console.error('Unable to connect to the database: ', error);
	});

// model Konsoli
const Console = sequelize.define(
	'Console',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		brand: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		ramSize: {
			type: DataTypes.INTEGER,
			allowNull: false,
			comment: 'In megabytes',
		},
	},
	{
		freezeTableName: true, // console
		tableName: 'consoles',
	}
);

await Console.sync(); // jeżeli tabela consoles już istnieje to sync() nic nie zrobi,
// ale jeśli nie ma tabeli consoles to zostanie utworzona

// Synchronizuje wszystkie utworzone wcześniej modele z bazą danych
await sequelize
	.sync()
	.then(() => {
		console.log('Table created successfully!');
	})
	.catch(error => {
		console.error('Unable to create table: ', error);
	});

await Console.create({
	brand: 'Playstation',
	name: 'PS2',
	ramSize: 32,
});


/* symulujemy zmiane modelu dopisujemy cpu */
const ConsoleUpdated = sequelize.define(
	'Console',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		brand: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		ramSize: {
			type: DataTypes.INTEGER,
			allowNull: false,
			comment: 'In megabytes',
		},
		cpu: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		freezeTableName: true, // console
		tableName: 'consoles',
	}
);


await ConsoleUpdated.sync({ force: true });
/*  force: true sprawi że skasowana będzie tabela
 consoles wraz z rekordami jeśli istnieje
 i utworzona będzie nowa tabela */

await ConsoleUpdated.create({
	brand: 'Playstation',
	name: 'PS3',
	ramSize: 512,
	cpu: 'Cell',
});

await sequelize.close();
