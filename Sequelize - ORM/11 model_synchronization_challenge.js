/*  
    Zadanie z synchronizacją modelu
    1. Napisz model Vegetable opisujący warzywo, dodaj nastepujące pola do pierwszej wersji modelu:
       - id jako UUID, primary key, domyślnie UUIDV4
       - name jako String o długości 24 znaków
    2. Wywołaj Vegetable.sync() aby zapisać do bazy tabelę, jeśli już jest w bazie to nic nie
       będzie zmienione w tabeli vegetables. Zapisz jedną instancję Vegetable z name Apple
    3. Stwórz kolejną wersję modelu Vegetable i zapisz ją do stałej VegetableUpdated, dodaj pola:
       - color jako ENUM z wartościami: red, white, yellow, orange, green, domyślnie red
       Wywołaj VegetableUpdated.sync({ force: true }) aby skasować poprzednią tabelę i zapisać nową.
       Stwórz i zapisz instancję owocu orange z użyciem modelu VegetableUpdated
    4. Napisz kolejną wersję modelu Vegetable w stałej VegetableAltered i dodaj dodatkowe pole:
       - price jako DECIMAL(4,2) z domyślną ceną 4.99
       Stwórz instancję owocu Lemon z ceną 10.00 i zapisz ją do bazy
       Wywołaj await VegetableAltered.sync({ alter: true }) co zaktualizuje tabelę bez jej kasowania
    5. Sprawdź stan bazy w podglądzie MySQL w przeglądarce
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

const Vegetable = sequelize.define('Vegetable', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING(24),
		allowNull: false,
	},
});

await Vegetable.sync();

await Vegetable.create({
	name: 'Apple',
});

/*
Vegetable.sync() - Tworzy tabelę jeśli nie istnieje, ale jeśli już jest to nic nie robi
Vegetable.sync({ force: true }) - tworzy tabelę, kasuje poprzednią jeśli już istnieje
Vegetable.sync({ alter: true }) - sprawdza aktualny stan bazy danych czyli kolumny i typy, 
                                następnie wykonuje aktualizacje jeśli są potrzebne aby 
                                zgadzały się z nową wersją modelu  
*/

const VegetableUpdated = sequelize.define('Vegetable', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING(24),
		allowNull: false,
	},
	color: {
		type: DataTypes.ENUM('red', 'white', 'yellow', 'orange', 'green'),
		defaultValue: 'red',
		allowNull: false,
	},
});

await VegetableUpdated.sync({ force: true });

await VegetableUpdated.create({
	name: 'Orange',
	color: 'orange',
});

const VegetableAltered = sequelize.define('Vegetable', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING(24),
		allowNull: false,
	},
	color: {
		type: DataTypes.ENUM('red', 'white', 'yellow', 'orange', 'green'),
		defaultValue: 'red',
		allowNull: false,
	},
	price: {
		type: DataTypes.DECIMAL(4, 2),
		defaultValue: 4.99,
		allowNull: true,
	},
});

await VegetableAltered.sync({ alter: true });

await VegetableAltered.create({
	name: 'Lemon',
	color: 'yellow',
	price: 10.0,
});

await sequelize.close();
