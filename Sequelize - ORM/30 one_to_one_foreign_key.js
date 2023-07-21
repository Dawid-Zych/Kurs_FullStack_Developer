/*     
    Sequelize - relacja one to one z ustawionym foreign key i zagnieżdżony include 
*/

import { Sequelize, DataTypes } from 'sequelize';

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

const CarDriver = sequelize.define(
	'CarDriver',
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
			validate: { len: [1, 16] },
		},
	},
	{
		timestamps: false,
	}
);

const SuperCar = sequelize.define(
	'SuperCar',
	{
		vin: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		brand: {
			type: DataTypes.STRING(16),
			allowNull: false,
			validate: { len: [1, 16] },
		},
		model: {
			type: DataTypes.STRING(16),
			allowNull: false,
			validate: { len: [1, 16] },
		},
		topSpeed: {
			type: DataTypes.DECIMAL(5, 2),
			defaultValue: 250,
			allowNull: true,
			validate: {
				isDecimal: true,
				min: 0.0,
				max: 500.0,
			},
		},
	},
	{
		timestamps: false,
	}
);

const CarEngine = sequelize.define(
	'CarEngine',
	{
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		numCylinders: {
			type: DataTypes.INTEGER,
			defaultValue: 4,
			allowNull: true,
		},
	},
	{
		timestamps: false,
	}
);

try {
	CarDriver.hasOne(SuperCar, {
		// parent
		foreignKey: 'fk_cardriver_id', // klucz fk w supercar!
	});
	SuperCar.belongsTo(CarDriver, {
		// child
		foreignKey: 'fk_cardriver_id', // klucz fk w supercar!
	});

	SuperCar.hasOne(CarEngine, {
		foreignKey: 'fk_supercar_id', // klucz w CarEngine
		type: DataTypes.UUID,
	});
	CarEngine.belongsTo(SuperCar, {
		foreignKey: 'fk_supercar_id', // klucz w CarEngine
		type: DataTypes.UUID,
	});

	await CarDriver.sync();
	await SuperCar.sync();
	await CarEngine.sync();

	const driver = await CarDriver.create({
		name: 'Adam',
	});

	const superCar = await SuperCar.create({
		brand: 'Ford',
		model: 'GT',
	});
	await superCar.setCarDriver(driver);

	const carEngine = await CarEngine.create({
		numCylinders: 8,
	});
	await carEngine.setSuperCar(superCar);

	const carDb = await CarDriver.findByPk(driver.dataValues.id, {
		include: [
			{
				model: SuperCar,
				include: [CarEngine],
			},
		],
	});

	console.log(JSON.stringify(carDb.dataValues, null, 4));
} catch (err) {
	console.log(err);
}

await sequelize.close();
