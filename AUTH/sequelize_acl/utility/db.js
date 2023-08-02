import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('schoolacl', 'root', '', {
	host: 'localhost',
	dialect: 'mysql2',
	decimalNumbers: true,
});

sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been established tothe database');
	})
	.catch(err => {
		console.log(err);
	});

	
export { sequelize };
