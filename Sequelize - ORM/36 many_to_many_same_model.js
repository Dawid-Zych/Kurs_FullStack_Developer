/* 
   Sequelize - relacja many to many w ramach tego samego modelu np przyjaciele, followersi itd 
*/

import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('test_db', 'root', '', {
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

const SocialUser = sequelize.define('SocialUser', {
	name: DataTypes.STRING,
});

const Connection = sequelize.define('Connection', {
	sourceId: DataTypes.INTEGER,
	relation: DataTypes.STRING,
	targetId: DataTypes.INTEGER,
});

await SocialUser.belongsToMany(SocialUser, {
	through: Connection,
	as: 'sources', // Żródło relacji użytkownika: przyjaciel, follower
	foreignKey: 'targetId',
});

await SocialUser.belongsToMany(SocialUser, {
	through: Connection,
	as: 'targets', // Użytkownik wskazuej na relację czyli z jego perspektywy jest
	foreignKey: 'sourceId', // przyjacielem kogoś
});

await SocialUser.sync();
await Connection.sync();

const ola = await SocialUser.create({ name: 'Ola' });
const kasia = await SocialUser.create({ name: 'Kasia' });
const adam = await SocialUser.create({ name: 'Adam' });
const zuza = await SocialUser.create({ name: 'Zuza' });

await ola.addTarget(kasia, { through: { relation: 'friend' } }); // Ola jest przyjacielem Kasi
await kasia.addTarget(ola, { through: { relation: 'friend' } }); // Kasia jest przyjacielem Oli

await adam.addTarget(kasia, { through: { relation: 'follow' } });
await zuza.addTarget(kasia, { through: { relation: 'follow' } });

const dbData = await SocialUser.findOne({
	where: { name: 'Kasia' },
	include: ['sources', 'targets'],
});

console.log(JSON.stringify(dbData, null, 4));
