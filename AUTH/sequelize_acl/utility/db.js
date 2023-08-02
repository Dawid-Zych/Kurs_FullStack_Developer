import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('schoolacl', 'root', '', {
	host: 'localhost',
	dialect: 'mysql',
	decimalNumbers: true,
});

sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been established to the database');
	})
	.catch(err => {
		console.log(err);
	});

export { sequelize };
