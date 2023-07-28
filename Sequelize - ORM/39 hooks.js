/* 
   Sequelize - hooks - to są specjalne funkcje które umożliwiają zachaczenie się na konkretne 
                       zdarzenia np utworzenie rekordu w bazie itd 
*/

import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('test_db', 'root', '', {
	host: 'localhost',
	dialect: 'mysql',
	decimalNumbers: true,
});

sequelize.beforeConnect(async config => {
	console.log('Hook beforeConnect for sequelize');
});

sequelize.afterConnect(async config => {
	console.log('Hook afterConnect for sequelize');
});

sequelize.beforeDisconnect(async config => {
	console.log('Hook beforeDisconnect for sequelize');
});

sequelize.afterDisconnect(async config => {
	console.log('Hook afterDisconnect for sequelize');
});

sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch(error => {
		console.error('Unable to connect to the database: ', error);
	});

const UserData = sequelize.define(
	'UserData',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			validate: { isInt: true },
		},
		name: {
			type: DataTypes.STRING(128),
			allowNull: false,
			validate: { len: [1, 128] },
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
			beforeValidate: async (userData, options) => {
				console.log('Hook beforeValidate for user: ', userData.name);
			},
		},
	}
);

UserData.addHook('beforeCreate', 'someHookName', (userData, options) => {
	console.log('Hook beforeCreate for user: ', userData.name);
});

UserData.addHook('beforeDestroy', (userData, options) => {
	console.log('Hook beforeDestroy for user: ', userData.name);
});

UserData.addHook('beforeSave', (userData, options) => {
	console.log('Hook beforeSave for user: ', userData.name);
});

UserData.addHook('beforeUpsert', (userData, options) => {
	console.log('Hook beforeUpsert for user: ', userData.name);
});

UserData.addHook('afterCreate', (userData, options) => {
	console.log('Hook afterCreate for user: ', userData.name);
});

UserData.addHook('afterDestroy', (userData, options) => {
	console.log('Hook afterDestroy for user: ', userData.name);
});

UserData.addHook('afterUpdate', (userData, options) => {
	console.log('Hook afterUpdate for user: ', userData.name);
});

UserData.addHook('beforeUpdate', (userData, options) => {
	console.log('Hook beforeUpdate for user: ', userData.name);
});

UserData.addHook('afterSave', (userData, options) => {
	console.log('Hook afterSave for user: ', userData.name);
});

UserData.addHook('afterUpsert', (userData, options) => {
	console.log('Hook afterUpsert for user: ', userData.name);
});


/* bardziej zaawansowane hooki przed po zapisaie wielu rekordow */
UserData.addHook('beforeBulkCreate', (userData, options) => {
	console.log('Hook beforeBulkCreate for user: ', userData.name);
});

UserData.addHook('afterBulkCreate', (userData, options) => {
	console.log('Hook afterBulkCreate for user: ', userData.name);
});

UserData.addHook('beforeBulkUpdate', (userData, options) => {
	console.log('Hook beforeBulkUpdate for user: ', userData.name);
});

UserData.addHook('afterBulkUpdate', (userData, options) => {
	console.log('Hook afterBulkUpdate for user: ', userData.name);
});

UserData.removeHook('beforeCreate', 'someHookName');

await sequelize.sync();

const user1 = await UserData.create({
	name: 'Kasia',
	email: Math.random() + '@example.com',
});
