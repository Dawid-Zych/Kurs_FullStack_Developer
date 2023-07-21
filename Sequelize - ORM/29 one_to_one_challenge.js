/*     
    Sequelize - relacja one to one - zadanie  
    1. Napisz model CarFactory z polami id i name
    2. Utwórz model CarFactoryAddress z polami id, street i city
    3. Stwórz relację one to one, gdzie adres należy do fabryki
    4. Zrób instancję CarFactory i CarFactoryAddress i połącz je ze sobą, odczytaj połączone
       rekordy z bazy 
*/

import { Sequelize, DataTypes, Op } from 'sequelize';

const sequelize = new Sequelize('test_db', 'root', '', {
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

const CarFactory = sequelize.define(
	'CarFactory',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			validate: { isInt: true },
		},
		name: {
			type: DataTypes.STRING(16),
			allowNull: false,
			validate: {
				len: [1, 16],
			},
		},
	},
	{
		timestamps: false,
	}
);

const CarFactoryAddress = sequelize.define(
	'CarFactoryAddress',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			validate: { isInt: true },
		},
		street: {
			type: DataTypes.STRING(24),
			allowNull: false,
			validate: { len: [1, 24] },
		},
		city: {
			type: DataTypes.STRING(24),
			allowNull: false,
			validate: { len: [1, 24] },
		},
	},
	{
		timestamps: false,
	}
);

try {
	CarFactory.hasOne(CarFactoryAddress);
	CarFactoryAddress.belongsTo(CarFactory);

	await CarFactory.sync();
	await CarFactoryAddress.sync();

	const carFactory = await CarFactory.create({
		name: 'Factory #001',
	});

	const carFactoryAddress = await CarFactoryAddress.create({
		street: 'Wilcza 7',
		city: 'Wawa',
	});

	await carFactoryAddress.setCarFactory(carFactory);

	const carFactoryDb = await CarFactory.findByPk(carFactory.dataValues.id, {
		include: CarFactoryAddress,
	});

	console.log(carFactoryDb.dataValues);
} catch (error) {
	console.log(error);
}

await sequelize.close();
