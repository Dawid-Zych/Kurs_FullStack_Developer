/* 
    Sequelize - relacja one to one   
*/

import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('test_db', 'root', '', {
	host: 'localhost',
	dialect: 'mysql',
	decimalNumbers: true,
});

await sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch(error => {
		console.error('Unable to connect to the database: ', error);
	});

const Administrator = sequelize.define(
	'Administrator',
	{
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
				len: [1, 16],
			},
		},
		surname: {
			type: DataTypes.STRING(32),
			allowNull: false,
			validate: {
				len: [1, 32],
			},
		},
		email: {
			type: DataTypes.STRING(128),
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
				len: [1, 128],
			},
		},
	},
	{
		timestamps: false,
	}
);

const AdminIdCard = sequelize.define(
	'AdminIdCard',
	{
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		expirationDate: {
			type: DataTypes.DATE,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			validate: {
				isDate: true,
			},
		},
	},
	{
		timestamps: false,
	}
);

/* tworzymy relacje pomiedzy naszymi modelami 
    sequalize zrobi nam ForeignKeys*/
try {
	Administrator.hasOne(AdminIdCard); // rodzic parent w relacji
	AdminIdCard.belongsTo(Administrator); // dziecko child w relacji, foreign key  AdministratorID

	await Administrator.sync();
	await AdminIdCard.sync();

	const admin = await Administrator.create({
		name: 'Admin #001',
		surname: 'Admiński',
		email: Math.random() + '@example.com',
	});

	const adminIdCard = await AdminIdCard.create({});
	/* połączenie naszego admina z kartą, robimy to z perspektywy dziecka */
	await adminIdCard.setAdministrator(admin);

	// drugi argument to opcje jakie dane również mają być załadowane
	const adminDb = await Administrator.findByPk(admin.dataValues.id, {
		include: AdminIdCard,
	});

	console.log(adminDb.dataValues);
} catch (error) {
	console.log(error);
}

await sequelize.close();
