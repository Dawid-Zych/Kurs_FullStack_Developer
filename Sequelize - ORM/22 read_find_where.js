/* 
    Sequelize - CRUD - read: find() z where
*/
// importujemy operatory Op do customers2
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

const WebShopCustomer = sequelize.define('WebShopCustomer', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		validate: {
			isInt: true, // wymagana liczba całkowita
		},
	},
	name: {
		type: DataTypes.STRING(24),
		allowNull: false,
		validate: {
			len: [1, 24], // min 1 i max 24 znaki
		},
	},
	surname: {
		type: DataTypes.STRING(24),
		allowNull: false,
		validate: {
			len: [1, 24], // min 1 i max 24 znaki
		},
	},
	email: {
		type: DataTypes.STRING(128),
		allowNull: false,
		unique: true,
		validate: {
			isEmail: {
				msg: 'email must be a valid address',
			},
			len: [4, 128], // min 4 i max 128 znaków
		},
	},
	shopPoints: {
		comment: 'Points earned in shop',
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			min: 0,
			max: 1000000,
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
				msg: "age can't be null",
			},
		},
	},
	registerDate: {
		type: DataTypes.DATE,
		defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
		allowNull: true,
		validate: {
			isDate: true, // ma być data
			isAfter: '2010-01-01', // data ma być po 2010 roku
			isBefore: '2055-01-01', // i przed 2055 rokiem
		},
	},
	themeColor: {
		type: DataTypes.STRING(12),
		defaultValue: 'light',
		validate: {
			isAlpha: true, // tylko litery
			notEmpty: true, // nie może być ""
			isLowercase: true, // małe litery, isUppercase też dostępne
			isIn: [['light', 'dark']],
		},
	},
});

// ZMIANA na alter by nie skasować bazy
await WebShopCustomer.sync({ alter: true }); // czyścimy bazę

function logCustomer(c) {
	console.log(c.id, c.name, c.surname, c.email, c.shopPoints, c.age, c.registerDate, c.themeColor);
}

try {
	const customersLightTheme = await WebShopCustomer.findAll({
		where: {
			themeColor: 'light',
			name: 'Daria',
		},
		offset: 1,
		limit: 2,
	});

	console.log('\ncustomers with light theme:');
	customersLightTheme.forEach(c => logCustomer(c.dataValues));

	const customers2 = await WebShopCustomer.findAll({
		where: {
			themeColor: {
				[Op.eq]: 'blue', // op equal blue
			}, // działa jako and
			id: {
				[Op.gt]: 27, // id > 27, natomiast gte to >= 3
			},
		},
	});

	console.log('\ncustomers2 with light theme:');
	customers2.forEach(c => logCustomer(c.dataValues));

	const customers3 = await WebShopCustomer.findAll({
		where: {
			[Op.and]: [
				{ id: { [Op.gte]: 5 } }, // id >= 5
				{ name: 'Kasia' },
				{ themeColor: ['red', 'green', 'blue', 'light'] }, // kolor jeden z nich
			],
		},
	});

	console.log('\ncustomers with r,g,b,l theme and id >= 5:');
	customers3.forEach(c => logCustomer(c.dataValues));

	// or jako lub
	const customers4 = await WebShopCustomer.findAll({
		where: {
			[Op.or]: [
				{ id: { [Op.lte]: 10 } }, // id <= 10,   lt to < 10
				{ shopPoints: { [Op.between]: [1, 98] } },
				{ shopPoints: { [Op.notBetween]: [100, 1000] } },
				{ themeColor: { [Op.in]: ['light', 'red', 'dark'] } },
				{ themeColor: { [Op.notIn]: ['green', 'blue', 'yellow'] } },
				{ name: { [Op.like]: 'A%' } }, // prefix ma być "A%"
				{ name: { [Op.notLike]: 'A%' } }, // prefix ma nie być "A%"
				{ name: { [Op.startsWith]: 'A' } }, // prefix ma być "A"
				{ name: { [Op.endsWith]: 'ia' } }, // suffix ma być "ia"
				{ name: { [Op.substring]: 'ol' } }, // LIKE "%ol%"
				{ id: { [Op.eq]: 12 } }, // id = 12
				{ id: { [Op.ne]: 12 } }, // id != 12
				{ themeColor: { [Op.is]: null } },
				{ themeColor: { [Op.not]: null } },
			],
		},
	});

	console.log('\ncustomers4 with options:');
	customers4.forEach(c => logCustomer(c.dataValues));

	// wyszukiwanie po primary key
	const customerByPk = await WebShopCustomer.findByPk(20);
	console.log('customer with id: 20', customerByPk.dataValues);

	const customerKasia = await WebShopCustomer.findOne({
		where: {
			name: 'Kasia',
		},
	});
	console.log('Kasia:', customerKasia.dataValues);

	// sprawdza czy dany rekord istnieje, jeśli nie tworzy go i zwraca
	const dataDb = await WebShopCustomer.findOrCreate({
		where: { name: 'QWERTY!' },
		defaults: {
			surname: 'Kowalski',
			email: 'qwerty@example.com',
			shopPoints: 100,
			age: 99,
			registerDate: new Date(),
			themeColor: 'light',
		},
	});
	console.log('dataDb:', dataDb);

	const dataDb2 = await WebShopCustomer.findAndCountAll({
		where: {
			name: {
				[Op.like]: 'Ol%',
			},
		},
	});

	console.log('rows:', dataDb2.rows);
	console.log('rows.count:', dataDb2.count);
} catch (err) {
	console.error(err);
}

await sequelize.close();
