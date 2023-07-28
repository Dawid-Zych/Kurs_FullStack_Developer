/* 
   Sequelize - transakcje 
   Zadanie 
   1. Utwórz model Microphone z id, brand i name 
   2. Rozpocznij transakcję i utwórz dwie instancje mikrofonów i zapisz je do bazy, następnie
      zakończ transakcję
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

const Microphone = sequelize.define('Microphone', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		validate: { isInt: true },
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
});

try {
	await sequelize.sync();
	const transaction = await sequelize.transaction();

	const mic1 = await Microphone.create(
		{
			brand: 'Mic',
			model: 'M1',
		},
		{ transaction }
	);

	const mic2 = await Microphone.create(
		{
			brand: 'Mic',
			model: 'M2',
		},
		{ transaction }
	);

	await transaction.commit();
} catch (error) {
	console.log(error);
	await transaction.rollback();
}
