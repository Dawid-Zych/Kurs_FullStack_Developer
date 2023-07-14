/*
    Sequelize - CRUD: create(), createBulk()   - create read update delete

    Create()
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

await WebShopCustomer.sync({ force: true });
// przy kazdym uruchomieniu będzie kasowana i robiona od nowa tabela

function getRandElFromArr(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomCustomer() {
	const namesArr = ['Ola', 'Kasia', 'Zuzia', 'Ania', 'Basia', 'Karolina', 'Agata', 'Daria', 'Marek', 'Tomek'];
	const surnameArr = ['Kowalska', 'Adamska', 'Barska', 'Karolińska', 'Darska', 'Mrowca'];
	const randNum = Math.floor(Math.random() * 100000);

	const name = getRandElFromArr(namesArr);
	const surname = getRandElFromArr(surnameArr);
	const email = name.toLowerCase() + '.' + surname.toLowerCase() + randNum + '@gmail.com';

	return {
		name: name,
		surname: surname,
		email: email,
		shopPoints: Math.floor(Math.random() * 1000),
		age: 18 + Math.floor(Math.random() * 50),
		registerDate: new Date(new Date().getTime() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365 * 5)),
		themeColor: getRandElFromArr(colorsArr),
	};
}

try {
	const customer = getRandomCustomer();
	await WebShopCustomer.create(customer);

	const customerArr = [];
	for (let i = 0; i < 30; i++) {
		customerArr.push(getRandomCustomer());
	}

	//Create and insert multiple instances in bulk
	const customersDb = await WebShopCustomer.bulkCreate(customerArr, { validate: true });

	for (const c of customersDb) {
		console.log(c.dataValues);
	}
} catch (error) {
	console.log(error);
}

await sequelize.close();
