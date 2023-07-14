/*
    Sequelize - CRUD: create(), bulkCreate()   
    Zadanie:

    1. Napisz model opisujący samochód jako Automobile z polami
    id, brand, name z podstawową walidacją
    distanceTraveled - int jako ilość przejechanych km 
            od 0 do 100 000, nie może być ujemna
    age - od 0 do 100
    productionDate - od 1950 do 2050
    color jeden z elementów tablicy: 'red','white','blue','green','black','orange','yellow'

    2. Stwórz losowy samochód z funkcją getRandomAutomobile() i zapisz rekord z create()
    
    3. Utworz tablicę 30 aut i zapisz je do bazy z bulkCreate()
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
			max: 100000,
			notNull: {
				msg: "Distance can't be null",
			},
			notBelowZero(value) {
				if (value < 0) {
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
		allowNull: true,
		defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
		validate: {
			isDate: true,
			isBefore: '2050-01-01',
			isAfter: '1950-01-01',
		},
	},
	color: {
		type: DataTypes.STRING,
		defaultValue: 'white',
		allowNull: false,
		validate: {
			isAlpha: true,
			notEmpty: true,
			isLowercase: true,
			isIn: [colorsArr],
		},
	},
});

await Automobile.sync({ force: true });

function getRandElFromArr(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomAutomobile() {
	const brandArr = ['Ford', 'GMC', 'Citroen', 'BMW', 'Dodge', 'Mercedes', 'Nissan', 'Opel'];
	const nameArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

	const brand = getRandElFromArr(brandArr);
	const name = getRandElFromArr(nameArr);

	return {
		name: name,
		brand: brand,
		distanceTraveled: Math.floor(Math.random() * 10000),
		age: Math.floor(Math.random() * 50),
		productionDate: new Date(new Date().getTime() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365 * 5)),
		color: getRandElFromArr(colorsArr),
	};
}

try {
	const auto = getRandomAutomobile();
	await Automobile.create(auto);
	console.log(auto);

	const autosArr = [];

	for (let i = 0; i < 30; i++) {
		autosArr.push(getRandomAutomobile());
	}

	const carsDb = await Automobile.bulkCreate(autosArr);
	for (const v of carsDb) {
		console.log(v.dataValues);
	}
} catch (error) {
	console.log(error);
}

await sequelize.close();
