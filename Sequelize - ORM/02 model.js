/* Zacznijmy od modelu w sequelize który pozwoli nam na
 utworzenie schematu oraz tabeli w bazie danych */

/* Należy pamiętać że sequelize automatycznie dodaje
 pola createdAt, i updatedAt  My po prostu nadpiszemy sobie
 domyślne żeby zobaczyć jak to sie robi  */

import { DataTypes, Sequelize } from 'sequelize';

const sequelize = new Sequelize('test', 'root', '', {
	host: 'localhost', // domyślnie
	dialect: 'mysql', // domyślnie
});

try {
	await sequelize.authenticate();
	console.log('Connected to database.');
} catch (error) {
	console.error('Unable to connect to database:', error);
}

const Animal = sequelize.define('Animal', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},

	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},

	type: {
		type: DataTypes.STRING,
		allowNull: true,
	},

	numLegs: {
		type: DataTypes.INTEGER,
		defaultValue: 2,
		allowNull: true,
	},

	createdAt: {
		type: DataTypes.DATE,
		defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
		allowNull: false,
	},
});

/* sprawdzamy czy mamy nasza bazę danych */
await sequelize
	.sync()
	.then(() => {
		console.log('Animal table created');
	})
	.catch(error => {
		console.log('Error when creating table: ', error);
	});

/* zapisa danych według tego modelu */

await Animal.create({
	name: 'Parrot',
	type: 'bird',
})
	.then(res => {
		console.log(res);
	})
	.catch(error => {
		console.log('Error when saving to database: ', error);
	});

await Animal.create({
	name: 'Shiba Inu',
	type: 'dog',
})
	.then(res => {
		console.log(res);
	})
	.catch(error => {
		console.log('Error when saving to database: ', error);
	});

await sequelize.close();
