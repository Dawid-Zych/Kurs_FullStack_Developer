/* 
   Sequelize - hooks  
   Zadanie:
   1. Dodaj hooki do sequalize dla: beforeConnect, afterConnect, beforeDisconnect, afterDisconnect
   2. Stwórz model AdminData z polami id, name i email. Dodaj również hooki bezpośrednio w modelu:
      - beforeValidate
      - afterValidate
      - validationFailed
    3. Dodaj kolejne hooki do AdminData ale po definicji modelu:
      - beforeCreate
      - beforeDestroy
      - beforeUpdate
      - beforeSave
      - beforeUpsert
      - afterCreate
      - afterUpdate
      - afterSave
      - afterUpsert
    4. Skasuj hook afterUpsert
*/

import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('test_db', 'root', '', {
	host: 'localhost',
	dialect: 'mysql',
	decimalNumbers: true,
});

sequelize.beforeConnect(async config => {
	console.log('Hook beforeConnect');
});

sequelize.afterConnect(async config => {
	console.log('Hook afterConnect');
});

sequelize.beforeDisconnect(async config => {
	console.log('Hook beforeDisconnect');
});

sequelize.afterDisconnect(async config => {
	console.log('Hook afterDisconnect');
});

sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch(error => {
		console.error('Unable to connect to the database: ', error);
	});

const AdminData = sequelize.define(
	'AdminData',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			validate: { isInt: true },
		},
		name: {
			type: DataTypes.STRING(16),
			allowNull: false,
			validate: { len: [1, 16] },
		},
		email: {
			type: DataTypes.STRING(128),
			allowNull: false,
			unique: true,
			validate: { isEmail: true, len: [1, 128] },
		},
	},
	{
		timestamps: false,
		hooks: {
			beforeValidate: async (adminData, options) => {
				console.log('Hook beforeValidate');
			},
			afterValidate: async (adminData, options) => {
				console.log('Hook afterValidate');
			},
			validationFailed: async (adminData, options) => {
				console.log('Hook validationFailed');
			},
		},
		sequelize,
	}
);

AdminData.addHook('beforeCreate', 'someHookName', (adminData, options) => {
	console.log('Hook beforeCreate');
});

AdminData.addHook('beforeDestroy', (adminData, options) => {
	console.log('Hook beforeDestroy');
});

AdminData.addHook('beforeUpdate', (adminData, options) => {
	console.log('Hook beforeUpdate');
});

AdminData.addHook('beforeSave', (adminData, options) => {
	console.log('Hook beforeSave');
});

AdminData.addHook('beforeUpsert', (adminData, options) => {
	console.log('Hook beforeUpsert');
});

AdminData.addHook('afterCreate', (adminData, options) => {
	console.log('Hook afterCreate');
});

AdminData.addHook('afterDestroy', (adminData, options) => {
	console.log('Hook afterDestroy');
});

AdminData.addHook('afterUpdate', (adminData, options) => {
	console.log('Hook afterUpdate');
});

AdminData.addHook('afterSave', (adminData, options) => {
	console.log('Hook afterSave');
});

AdminData.addHook('afterUpsert', (adminData, options) => {
	console.log('Hook afterUpsert');
});

AdminData.removeHook('afterUpsert');

await sequelize.sync();

const admin1 = await AdminData.create({
	name: 'Admin',
	email: Math.random() + '@example.com',
});
