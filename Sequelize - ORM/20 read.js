/*
    Sequelize - CRUD: find()
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

const colorsArr = ['light', 'dark', 'silver', 'blue', 'red'];

const WebShopCustomer = sequelize.define('WebShopCustomer', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		validate: {
			isInt: true,
		},
	},
	name: {
		type: DataTypes.STRING(16),
		allowNull: false,
		validate: {
			len: [1, 16],
		},
	},
	surname: {
		type: DataTypes.STRING(32),
		allowNull: false,
		validate: {
			len: [1, 32],
		},
	},
	email: {
		type: DataTypes.STRING(128),
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true,
			len: [5, 128],
		},
	},
	shopPoints: {
		comment: 'Points earned in the web shop',
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			min: 0,
			max: 100000,
			notNull: {
				msg: "Points can't be null",
			},
			notBelowZero(value) {
				if (value < 0) {
					throw new Error("Points can't be negative");
				}
			},
		},
	},
	age: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			min: 18,
			max: 100,
			notNull: {
				msg: "Age can't be null",
			},
		},
	},
	registerDate: {
		type: DataTypes.DATE,
		defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
		allowNull: true,
		validate: {
			isDate: 'true',
			isAfter: '2010-01-01',
			isBefore: '2055-01-01',
		},
	},
	themeColor: {
		type: DataTypes.STRING(12),
		defaultValue: 'light',
		validate: {
			isAlpha: true,
			notEmpty: true,
			isLowercase: true,
			isIn: [colorsArr],
		},
	},
});

await WebShopCustomer.sync();

// funkcja do logowania customerów
function logCustomer(c) {
	console.log(c.id, c.name, c.surname, c.email, c.shopPoints, c.age, c.registerDate, c.themeColor);
}

try {
	// findAll() - wszyscy użytkownicy z bazy danych
	const customers = await WebShopCustomer.findAll();
	console.log('\nAll customers:');
	customers.forEach(e => logCustomer(e));

	// Przekazujemy dodatkowe infomacje jakie chcemy kolumny uzyskać
	const customers2 = await WebShopCustomer.findAll({
		attributes: ['id', 'name', 'email'],
	});
	console.log('\nAll customers2:');
	customers2.forEach(e => logCustomer(e));

	// możemy zmienić nazwy zwracanych kolumn
	const customers3 = await WebShopCustomer.findAll({
		attributes: [['id', 'customerId'], 'name', ['email', 'customerEmail']],
	});
	console.log('\nAll customers3:');
	customers3.forEach(c => {
		// musimy przypisać dataValues bo inaczej będzie błąd
		c = c.dataValues;
		console.log('customerId:' + c.customerId, 'name: ' + c.name, 'customerEmail: ' + c.customerEmail);
	});

	// wykorzystanie funkcji Mysql count
	const customersNumIds = await WebShopCustomer.findAll({
		attributes: ['name', [sequelize.fn('COUNT', sequelize.col('id')), 'numIds'], 'email'],
	});
	console.log('\nCustomers numIds with Count()', customersNumIds[0].dataValues);

	// wykorzystanie funkcji Mysql sum
	const customersAgeSum = await WebShopCustomer.findAll({
		attributes: ['name', [sequelize.fn('SUM', sequelize.col('age')), 'ageSum'], 'email'],
	});
	console.log('\nCustomers numIds with SUM()', customersAgeSum[0].dataValues);

	// maksymalna wartosć id
	const customersMaxId = await WebShopCustomer.findAll({
		attributes: {
			include: [[sequelize.fn('MAX', sequelize.col('id')), 'maxId']],
			exclude: ['email', 'createdAt', 'updatedA'],
		},
	});
	console.log('\nCustomers max id num', customersMaxId[0].dataValues);
} catch (error) {}

await sequelize.close();
