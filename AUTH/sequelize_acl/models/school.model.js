import { DataTypes } from 'sequelize';
import { sequelize } from '../utility/db.js';

const School = sequelize.define('School', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		validate: {
			isInt: true,
		},
	},
	name: {
		type: DataTypes.STRING(32),
		allowNull: true,
		validate: {
			len: [1, 32],
		},
	},
	address: {
		type: DataTypes.STRING(256),
		allowNull: true,
		validate: {
			len: [1, 256],
		},
	},
});

export { School };
