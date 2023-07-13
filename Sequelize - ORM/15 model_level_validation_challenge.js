/*  
    Sequelize - walidacja danych na poziomie modelu
    Zadanie
    1. Stwórz model Fruit opisujący owoc z polami:
       - id - int, primary key, auto increment, walidacja że to int
       - name - STRING
       - color - STRING
    2. Dodaj walidację na poziomie modelu dla name i color w postaci jednej metody, która
       sprawdzi czy:
       - name jest mniejsze niż dwa znaki, zwróć wyjątek w takim przypadku
       - color musi być jednym z następujących: "red", "black", "white", "green", "blue", "yellow"
               w innym wypadku zwróć wyjątek
    3. Stwórz nową instancję Fruit i zapisz ją w bazie
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

const Fruit = sequelize.define(
	'Fruit',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			validate: {
				isInt: true,
			},
		},
		name: DataTypes.STRING(16),
		color: DataTypes.STRING(16),
	},
	{
		timestamps: false,
		validate: {
			fruitValidation() {
				if (this.name.length < 2) {
					throw new Error('name must be ate least 2 characters length');
				}

				const allowedColors = ['red', 'black', 'white', 'green', 'blue', 'yellow'];
				if (!allowedColors.includes(this.color)) {
					throw new Error(' Color must be one of the value from list: ' + allowedColors.join());
				}
			},
		},
	}
);

await Fruit.sync();

await Fruit.create({
	name: 'apple',
	color: 'red',
});

await sequelize.close();
