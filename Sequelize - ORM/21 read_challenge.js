/*   
    Sequelize - CRUD: read z find()
    Zadanie: 
    1. Wykorzystaj model Automobile z poprzedniego zadania, skasuj force:true w sync()
    2. Napisz funkcję logAuto(a) do pokazania danych samochodu z bazy
    3. Pobierz wszystkie samochody z findAll() i pokaż je w konsoli
    4. Pobierz z findAll() wszystkie auta ale tylko z kolumnami: id, brand, name
    5. Ponownie odczytaj wszystkie auta, zmień nazwy kolumn z id na carId, brand, name na carName
    6. Policz ilość rekordów aut z COUNT() w sequalize i wyświetl w konsoli
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

const colorsArr = ['red', 'white', 'blue', 'green', 'black', 'orange', 'yellow'];

const Automobile = sequelize.define('Automobile', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		validate: {
			isInt: true,
		},
	},
	brand: {
		type: DataTypes.STRING(16),
		allowNull: false,
		validate: {
			len: [1, 16],
		},
	},
	name: {
		type: DataTypes.STRING(32),
		allowNull: false,
		validate: {
			len: [1, 32],
		},
	},
	distanceTraveled: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			min: 0,
			max: 1000000,
			notNull: {
				msg: "Distance can't be null",
			},
			notBelowZero(v) {
				if (v < 0) {
					throw new Error("Distance can't be negative");
				}
			},
		},
	},
	age: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			min: 0,
			max: 100,
			notNull: {
				msg: "Age can't be null",
			},
		},
	},
	productionDate: {
		type: DataTypes.DATE,
		defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
		allowNull: true,
		validate: {
			isDate: true,
			isAfter: '1950-01-01',
			isBefore: '2050-01-01',
		},
	},
	color: {
		type: DataTypes.STRING(12),
		defaultValue: 'red',
		validate: {
			isAlpha: true,
			notEmpty: true,
			isLowercase: true,
			isIn: [colorsArr],
		},
	},
});

await Automobile.sync();

function logAuto(a) {
	console.log(a.id, a.brand, a.name, a.distanceTraveled, a.age, a.productionDate, a.color);
}

try {
	const autos1 = await Automobile.findAll();
	console.log('\nAll cars:');
	autos1.forEach(a => logAuto(a));

	const autos2 = await Automobile.findAll({
		attributes: ['id', 'brand', 'name'],
	});
	console.log('\nAll cars with id, brand, name:');
	autos2.forEach(a => logAuto(a));

	const autos3 = await Automobile.findAll({
		attributes: [['id', 'carID'], 'brand', ['name', 'carName']],
	});
	console.log('\nAll cars with id, brand, name:');
	autos3.forEach(a => {
		a = a.dataValues;
		console.log('carID:', a.carID, 'brand:', a.brand, 'carName:', a.carName);
	});

	const autosNumIds = await Automobile.findAll({
		attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'numIds']],
	});
	console.log('\nAutos numIds:', autosNumIds[0].dataValues);

	const auto123 = await Automobile.findOne({
		where: {
			id: 2,
		},
	});

	console.log(auto123);
} catch (err) {
	console.error(err);
}

await sequelize.close();
