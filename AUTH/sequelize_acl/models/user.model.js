import { DataTypes } from 'sequelize';
import { sequelize } from '../utility/db.js';

const User = sequelize.define('User', {
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
	surname: {
		type: DataTypes.STRING(64),
		allowNull: true,
		validate: {
			len: [1, 64],
		},
	},
	email: {
		type: DataTypes.STRING(32),
		allowNull: false,
		unique: true,
		validate: {
			len: [1, 32],
			isEmail: true,
		},
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			notNull: {
				msg: 'Password is needed',
			},
			notEmpty: {
				msg: 'Please provide a password',
			},
			isNotEasy: function (value) {
				value = value.toLowerCase();

				if (value.includes('12345') || value.includes('54321') || value.includes('admin')) {
					throw new Error('Password is too simple');
				}
			},
		},
	},
	age: {
		type: DataTypes.INTEGER,
		allowNull: true,
		defaultValue: 18,
		validate: {
			isInt: true,
		},
	},
	address: {
		type: DataTypes.STRING(256),
		allowNull: true,
		validate: {
			len: [1, 256],
		},
	},
	role: {
		type: DataTypes.ENUM('admin', 'director', 'teacher', 'student'),
		defaultValue: 'student',
		allowNull: false,
		validate: {
			len: [1, 12],
		},
	},
});

export { User };
