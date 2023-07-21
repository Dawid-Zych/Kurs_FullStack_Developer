/*   
    Sequelize - CRUD: read z find() i where
    Zadanie: 
    1. Wykorzystaj model Automobile, napisz funkcję logAuto() do pokazania danych samochodu z bazy
    2. Odczytaj wszystkie czerwone auta z findAll() i pokaż je w konsoli
    3. Pokaż czerwone i czarne auta Citroen z bazy wykorzystując findAll(), ogranicz wyniki do 5
    4. Pobierz auta Ford wykorzystując Op.eq, id aut ma być większe równe 2
    5. Wczytaj auta z Op.and gdzie muszą być spełnione wszystkie warunki:
        - id większe od 10
        - brand jako jeden z ["Ford", "Citroen", "Dodge"]
        - color jako jeden z ["red", "white", "blue"]
    6. Pokaż auta z bazy korzystając z Op.or dla nastepujących warunków:
        - id mniejsze równe od 10
        - color jest red lub blue z operatorem Op.in
        - brand zaczyna się na C z operatorem Op.like
    7. Wczytaj auto po primary key id z wartością 5
    8. Wykorzystaj findOrCreate() do utworzenia nowego auta w bazie dla brand "TEST"
    9. Policz ilość aut zaczynających się na "F" z findAndCountAll()
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
	const redCars = await Automobile.findAll({
		where: {
			color: 'red',
		},
	});
	redCars.forEach(a => logAuto(a.dataValues));

	const citroenCars = await Automobile.findAll({
		where: {
			brand: 'Citroen',
			color: ['red', 'black'],
		},
		limit: 5,
	});
	console.log('\nCitroens:');
	citroenCars.forEach(a => logAuto(a.dataValues));

	const fordCars = await Automobile.findAll({
		where: {
			brand: {
				[Op.eq]: 'Ford',
			},
			id: {
				[Op.gte]: 2, // id >= 2
			},
		},
	});
	console.log('\nFords:');
	fordCars.forEach(a => logAuto(a.dataValues));

	const cars2 = await Automobile.findAll({
		where: {
			[Op.and]: [
				{ id: { [Op.lte]: 10 } }, // id =< 10
				{ brand: ['Ford', 'Citroen', 'Dodge'] },
				{ color: ['red', 'white', 'blue'] },
			],
		},
	});
	console.log('\nCars2:');
	cars2.forEach(a => logAuto(a.dataValues));

	const cars3 = await Automobile.findAll({
		where: {
			[Op.or]: [
				{ id: { [Op.lte]: 10 } }, // id <= 10
				{ color: { [Op.in]: ['red', 'blue'] } },
				{ brand: { [Op.like]: 'C%' } },
			],
		},
	});
	console.log('\nCars3:');
	cars3.forEach(a => logAuto(a.dataValues));

	const carByPk = await Automobile.findByPk(5);
	console.log('Car by id 5:', carByPk);

	const dataDb = await Automobile.findOrCreate({
		where: {
			brand: 'TEST',
		},
		defaults: {
			name: 'XY1',
			distanceTraveled: 100,
			age: 20,
			registerDate: new Date(),
			color: 'red',
		},
	});
	console.log('dataDb:', dataDb);

	const dataDb2 = await Automobile.findAndCountAll({
		where: {
			brand: {
				[Op.like]: 'F%',
			},
		},
	});
	console.log('dataDb2.count:', dataDb2.count);
} catch (err) {
	console.error(err);
}

await sequelize.close();
