/*
   Sequelize nie wspiera dla MYSQL typu Array jak POSTGRES ale można go łatwo
   emulować z getterem i setterem
*/

import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('test', 'root', '', {
	host: 'localhost',
	dialect: 'mysql',
});

try {
	await sequelize.authenticate();
	console.log('Connected to database.');
} catch (error) {
	console.error('Unable to connect to database:', error);
}

const Train = sequelize.define('Train', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true,
	},
	brand: {
		type: DataTypes.STRING(12),
		allowNull: false,
	},
	model: {
		type: DataTypes.STRING(24),
		allowNull: false,
	},
	topSpeed: {
		type: DataTypes.DECIMAL(5, 2),
		allowNull: true,
	},
	isElectric: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
		allowNull: false,
	},
	popularClass: {
		type: DataTypes.ENUM('economy', 'first', 'buissness'),
		defaultValue: 'economy',
		allowNull: false,
	},
	purchaseDate: {
		type: DataTypes.DATE,
		defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
		allowNull: false,
	},
	carriageIds: {
		// emulacja Array w MySQL
		type: DataTypes.STRING,
		allowNull: false,
		get() {
			return this.getDataValue('carriageIds').split(',');
		},
		set(v) {
			this.setDataValue('carriageIds', v.join(','));
		},
	},
});

/* sprawdzamy czy mamy nasza bazę danych */
await sequelize
	.sync()
	.then(() => {
		console.log('Trains table created successfully!');
	})
	.catch(error => {
		console.log('Error when creating table: ', error);
	});

/* zapis danych według tego modelu */

await Train.create({
	brand: 'Pendolino',
	model: 'ED250',
	topSpeed: 200.0,
	isElectric: true,
	purchaseDate: new Date(),
	carriageIds: ['Carriage #001', 'Carriage #002', 'Carriage #003', 'Carriage #004'],
});

await sequelize.close();
