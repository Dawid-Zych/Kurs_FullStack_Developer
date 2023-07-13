import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('test', 'root', '', {
	host: 'localhost',
	dialect: 'mysql',
});

try {
	await sequelize.authenticate();
	console.log('udane połączenie z bazą danych');
} catch (error) {
	console.log('Error: ', error);
}

const CorporateEmployee = sequelize.define('CorporateEmployee', {
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
			len: [3, 24],
			notEmpty: true,
			notNull: {
				msg: "Name can't be null",
			},
		},
	},
	surname: {
		type: DataTypes.STRING(24),
		allowNull: false,
		validate: {
			len: [3, 24],
			notEmpty: true,
			notNull: {
				msg: "Surname can't be null",
			},
		},
	},
	email: {
		type: DataTypes.STRING(128),
		allowNull: true,
		unique: true,
		validate: {
			isEmail: {
				msg: 'Email must be a valid email address',
			},
			len: [4, 128],
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
	birthday: {
		type: DataTypes.DATE,
		allowNull: true,
		validate: {
			isDate: true,
			isAfter: '1950-01-01',
			isBefore: '2050-01-01',
		},
	},
	yearsExperience: {
		type: DataTypes.INTEGER,
		allowNull: true,
		validate: {
			isInt: true,
			customValidator(value) {
				if (value < 0) {
					throw new Error("Years experience can't be a negative number");
				}
			},
		},
	},
	companyName: {
		type: DataTypes.STRING(32),
		defaultValue: 'Example Corporation.',
		allowNull: true,
		validate: {
			notEmpty: true,
			contains: 'Corporation',
		},
	},
	companyPosition: {
		type: DataTypes.STRING(16),
		defaultValue: 'programmer',
		validate: {
			isAlpha: true,
			notEmpty: true,
			notIn: [['saboteur', 'spy']],
			isIn: [['CEO', 'CFO', 'programmer', 'manager']],
			notContains: 'test',
		},
	},
	linkedin: {
		type: DataTypes.STRING(128),
		allowNull: true,
		validate: {
			notEmpty: true,
			isUrl: true,
		},
	},
});

await CorporateEmployee.sync();

try {
	await CorporateEmployee.create({
		name: 'Kasia',
		surname: 'Adamska',
		email: 'kasia.adamska@gmail.com',
		age: 33,
		birthday: new Date(),
		yearsExperience: 7,
		companyName: 'Example Corporation',
		companyPosition: 'CFO',
		linkedin: 'https://linkedin.com/kasia.adamska',
	});
} catch (err) {
	console.error(err);
}

await sequelize.close();
