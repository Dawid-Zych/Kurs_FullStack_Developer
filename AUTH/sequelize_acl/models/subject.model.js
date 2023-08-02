import { DataTypes } from 'sequelize';
import { sequelize } from '../utility/db.js';

const Subject = sequelize.define('Subject', {
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
		allowNull: false,
		validate: {
			len: [1, 32],
		},
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
});

export { Subject };
