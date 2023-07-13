/*
    Sequelize - pole Virtual, które nie jest zapisywane do bazy, może być użyte np do
                walidacji potwierdzenia hasła
*/

import { Sequelize, DataTypes } from 'sequelize';

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

const WebsiteUser = sequelize.define('WebsiteUser', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING(16),
		allowNull: false,
		validate: {
			len: [2, 16],
		},
	},
	email: {
		type: DataTypes.STRING(128),
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true,
		},
	},
	password: {
		type: DataTypes.VIRTUAL, // nie będzie zapisane do bazy danych !
		allowNull: false,
		validate: {
			notNull: {
				msg: 'Password is needed',
			},
			notEmpty: {
				msg: 'Please provide a password',
			},
			len: {
				args: [5, 32],
			},
			isNotEasy: function (val) {
				val = val.toLowerCase();

				if (val.includes('12345') || val.includes('54321') || val.includes('admin')) {
					throw new Error(' Password ' + val + ' is to easy! ');
				}
			},
		},
	},
	confirmedPassword: {
		type: DataTypes.STRING(32),
		allowNull: false,
		set: function (val) {
			if (val === this.password) {
				const secretSalt = 'SECRET_SALT';
				this.setDataValue('confirmedPassword', secretSalt + val);
			}
		},
		validate: {
			notNull: {
				msg: 'Confirmed password must match with password',
			},
			notEmpty: {
				msg: 'Please provide password confirmation',
			},
			len: [6, 32],
		},
	},
});

await WebsiteUser.sync();

await WebsiteUser.create({
	name: 'Adam',
	email: 'Adam@example.com',
	password: 'Adamus12!',
	confirmedPassword: 'Adamus12!',
});

await sequelize.close();
