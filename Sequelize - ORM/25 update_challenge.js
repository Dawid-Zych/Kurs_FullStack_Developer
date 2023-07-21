/* 
    Sequelize - CRUD: update() - aktualizacja rekordów
    Zadanie
    1. Wykorzystaj metode update() do aktualizacji auta o id 25 wartościami brand: Ford name:T
    2. Wykorzystaj upsert() do dodania nowego rekordu
    3. Wykorzystaj upsert() do aktualizacji rekordu o id 25
*/

import { Sequelize, DataTypes, Op } from 'sequelize';
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

function getRandArrEl(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomAutomobile() {
	const brandArr = ['Ford', 'GMC', 'Citroen', 'BMW', 'Dodge', 'Mercedes', 'Nissan'];
	const nameArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
	const brand = getRandArrEl(brandArr);
	const name = getRandArrEl(nameArr);

	return {
		brand: brand,
		name: name,
		distanceTraveled: Math.floor(Math.random() * 10000),
		age: Math.floor(Math.random() * 50),
		productionDate: new Date(new Date().getTime() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365 * 10)),
		color: getRandArrEl(colorsArr),
	};
}

function logAuto(a) {
	console.log(a.id, a.brand, a.name, a.distanceTraveled, a.age, a.productionDate, a.color);
}

try {
	const updatedAuto1 = await Automobile.update(
		{
			brand: 'Ford',
			name: 'T',
		},
		{
			where: {
				id: 25,
			},
		}
	);
	console.log('UpdatecCar1:', updatedAuto1);

	const [upsertedData1, upsertedData1Flag] = await Automobile.upsert({
		brand: 'Dodge',
		name: 'Viper',
		distanceTraveled: 1000,
		age: 25,
		color: 'blue',
	});
	console.log('upsertedData1:', upsertedData1);
	console.log('upsertedData1Flag:', upsertedData1Flag);

	const [upsertedData2, upsertedData2Flag] = await Automobile.upsert({
		id: 20,
		brand: 'Dodge',
		name: 'Viper',
		distanceTraveled: 1000,
		age: 25,
		color: 'red',
	});
	console.log('upsertedData2:', upsertedData2);
	console.log('upsertedData2Flag:', upsertedData2Flag);
} catch (err) {
	console.log(err);
}

await sequelize.close();
