/*
    Sequalize - walidacja danych na poziomie modelu
*/

import { DataTypes, Sequelize } from 'sequelize';

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

const SchoolStudent = sequelize.define(
	'SchoolStudent',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			validate: {
				isInt: true,
			},
		},
		name: DataTypes.STRING(32),
		surname: DataTypes.STRING(32),
		email: DataTypes.STRING(128),
	},
	{
		timestamps: false,
		validate: {
			studentValidation() {
				if (this.name.length < 2) {
					throw new Error('Name length must be at least 2 characters length');
				}
				if (this.surname.length < 2) {
					throw new Error('Surname length must be at least 2 characters length');
				}
				if (!this.email.includes('@')) {
					throw new Error('Email must have @ sign');
				}
			},
		},
	}
);

await SchoolStudent.sync();

await SchoolStudent.sync();

try {
	await SchoolStudent.create({
		name: 'Ola',
		surname: 'Kowalska',
		email: 'test@example.com',
	});
} catch (error) {
	console.log(error);
}

await sequelize.close();
