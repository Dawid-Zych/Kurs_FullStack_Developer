/*
    Sequalize - walidacja danych
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

const UniversityStudent = sequelize.define('UniversityStudent', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		validate: {
			isInt: true,
		},
	},
	name: {
		type: DataTypes.STRING(24),
		allowNull: false,
		validate: {
			len: [3, 24], // dlugosc od 3 do 24 znaków
		},
	},
	email: {
		type: DataTypes.STRING(128),
		allowNull: false,
		unique: true,
		validate: {
			is: /.+\@.+\..+/,
			len: 4, // min 4 znaki
		},
	},
	email2: {
		type: DataTypes.STRING(128),
		allowNull: true,
		unique: true,
		validate: {
			isEmail: {
				msg: 'email2 must be a valid email address',
			},
			len: [4 - 128], // min 4 i max 128 znaków
		},
	},
	age: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			min: 18,
			max: 100,
			notNull: {
				msg: "age can't be null",
			},
		},
	},
	registerDate: {
		type: DataTypes.DATE,
		defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
		allowNull: true,
		validate: {
			isDate: true,
			isAfter: '2010-01-01',
			isBefore: '2023-12-12',
		},
	},
	employmentYearsExperience: {
		type: DataTypes.INTEGER,
		allowNull: true,
		validate: {
			customValidator(value) {
				if (value < 0) {
					throw new Error("Employment experience must be above 0, can't be negative");
				}
			},
		},
	},
	companyName: {
		type: DataTypes.STRING(32),
		defaultValue: 'Example Ltd.',
		allowNull: true,
		validate: {
			contains: 'Ltd', // String musi mieć tekst Ltd
		},
	},
	favColor: {
		type: DataTypes.STRING(12),
		defaultValue: 'red',
		validate: {
			isAlpha: true, // tylko litery jako treść,
			/* isNull: true, // wymaga null
			isAlphanumeric: true, // liczby oraz litery ale bez spacji przecinka czy _
			isInt: true, // liczba całkowita
			isFloat: true, // liczba zmienno-przecinkowa
			isDecimal: true, // jakikolwiek number */
			notEmpty: true, // nie może być to pusty łańcuch znaków ""
			isLowercase: true, // małe litery
			// isUppercase: true, // duże litery
			isIn: [['red', 'green', 'blue', 'white', 'orange']], // tylko te elementy dopuszczalne jako wartość
			notIn: [['something', 'bad']], // elementy które nie będą dopuszczane jako wartość
			notContains: 'bar', // jakiego słówka ma nie być
		},
	},
	linkedin: {
		type: DataTypes.STRING(128),
		allowNull: true,
		validate: {
			isUrl: true,
			// isCreditCard: true
		},
	},
});

await UniversityStudent.sync();

try {
	await UniversityStudent.create({
		name: 'Ola',
		email: 'ola.kowalska@gmail.com',
		email2: 'ola.kowalska2@gmail.com',
		age: 29,
		registerDate: new Date(),
		employmentYearsExperience: 4,
		companyName: 'Ola Company Ltd.',
		favColor: 'green',
		linkedin: 'https://linkedin.com/ola.kowalska',
	});
} catch (error) {
	console.error(error);
}

await sequelize.close();
