/*   
    Sequelize - relacje fabryki dronów, wymaga utworzenia bazy drones w mysql
*/

import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('drones', 'root', '', {
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

/*  podstawowy model adresu */
const Address = sequelize.define('Address', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		validate: {
			isInt: true,
		},
	},
	name: {
		type: DataTypes.STRING(128),
		allowNull: true,
		validate: {
			len: [1, 128],
		},
	},
	street: {
		type: DataTypes.STRING(24),
		allowNull: true,
		validate: {
			len: [1, 24],
		},
	},
	city: {
		type: DataTypes.STRING(24),
		allowNull: true,
		validate: {
			len: [1, 24],
		},
	},
	postalCode: {
		type: DataTypes.STRING(8),
		allowNull: true,
		validate: {
			len: [1, 8],
		},
	},
	country: {
		type: DataTypes.STRING(24),
		allowNull: true,
		validate: {
			len: [1, 24],
		},
	},
});

/*  model opisujący naszą fabrykę */
const DronesFactory = sequelize.define('DronesFactory', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		validate: {
			isInt: true,
		},
	},
	name: {
		type: DataTypes.STRING(128),
		allowNull: true,
		validate: {
			len: [1, 128],
		},
	},
});

/* fabryka będzie podrzędna do addresu */
Address.hasOne(DronesFactory, {
	foreignKey: 'fk_address_id',
});

DronesFactory.belongsTo(Address, {
	foreignKey: 'fk_address_id', // jest tylko w DronesFactory!
});
