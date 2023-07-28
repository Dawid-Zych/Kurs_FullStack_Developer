/* 
   Sequelize - transakcje 
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

const Tablet = sequelize.define('Tablet', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		validate: { isInt: true },
	},
	brand: {
		type: DataTypes.STRING(16),
		allowNull: false,
		validate: { len: [2, 16] },
	},
	model: {
		type: DataTypes.STRING(16),
		allowNull: false,
		validate: { len: [2, 16] },
	},
});

const transaction = await sequelize.transaction();

try {
	await sequelize.sync();

	const tablet1 = await Tablet.create(
		{
			brand: 'Tablet',
			model: 'X1',
		},
		{ transaction }
	);

	const tablet2 = await Tablet.create(
		{
			brand: 'Tablet',
			model: 'X2',
		},
		{ transaction }
	);

	await transaction.commit();
} catch (err) {
	console.log(err);
	await transaction.rollback();
}

await sequelize.close();
