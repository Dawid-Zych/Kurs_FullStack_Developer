/* 
    Sequelize - walidacja danych
    1. Stwórz model SystemUser z polami:
       - id, name, surname, email z podstawową walidacją
       - password jako VIRTUAL z walidacją hasła
       - confirmedPassword jako STRING, gdzie w walidacji sprawdzisz czy zgadza się z password
    2. Utwórz instancję SystemUser i zapisz ją do bazy                
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

const SystemUser = sequelize.define('SystemUser', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		validate: {
			isInt: true,
		},
	},
	name: {
		type: DataTypes.STRING(16),
		allowNull: false,
		validate: {
			len: [3, 16],
		},
	},
	surname: {
		type: DataTypes.STRING(24),
		allowNull: false,
		validate: {
			len: [3, 24],
		},
	},
	email: {
		type: DataTypes.STRING(128),
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true,
			len: [3, 128],
		},
	},
	password: {
		type: DataTypes.VIRTUAL,
		allowNull: false,
		validate: {
			notNull: {
				msg: 'Password is needed',
			},
			notEmpty: {
				msg: 'Please provide a password',
			},
			len: {
				args: [6, 32],
				msg: 'Min 6 max 32 characters',
			},
		},
	},
	confirmedPassword: {
		type: DataTypes.STRING,
		allowNull: false,
		set: function (val) {
			if (val === this.password) {
				const secret = 'SECRET_SALT';
				this.setDataValue('confirmedPassword', secret + val);
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

await SystemUser.sync();

await SystemUser.create({
	name: 'Anna',
	email: 'anna@example.com',
	surname: 'Kowalska',
	password: 'Ana576!!',
	confirmedPassword: 'Ana576!!',
});

await sequelize.close();
