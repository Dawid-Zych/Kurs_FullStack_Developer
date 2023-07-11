import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('test', 'root', '', {
	host: 'localhost',
	dialect: 'mysql',
});

try {
	await sequelize.authenticate();
	console.log('Połączono z bazą danych');
} catch (error) {
	console.error('Unable to connect to database:', error);
}

const Tv = sequelize.define('Tv', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true,
	},
	brand: {
		type: DataTypes.STRING(12),
		allowNull: false,
	},
	model: {
		type: DataTypes.STRING(24),
		allowNull: false,
	},
	screenSize: {
		type: DataTypes.DECIMAL(5, 2),
		allowNull: true,
		defaultValue: 24,
	},
	isRlcd: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
		allowNull: false,
	},
	color: {
		type: DataTypes.ENUM('black', 'silver', 'white'),
		allowNull: false,
		defaultValue: 'black',
	},
	purchaseDate: {
		type: DataTypes.DATE,
		defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
		allowNull: false,
	},
	channels: {
		type: DataTypes.STRING,
		allowNull: false,
		get() {
			return this.getDataValue('channels').split(',');
		},
		set(v) {
			this.setDataValue('channels', v.join(','));
		},
	},
});


await sequelize
	.sync()
	.then(() => {
		console.log('Table created successfully!');
	})
	.catch(error => {
		console.error('Unable to create table : ', error);
	});

await Tv.create({
	brand: 'SVD',
	model: 'PC RLCD monitor',
	screenSize: 32,
	isRlcd: true,
	purchaseDate: new Date(),
	color: 'black',
	channels: ['hdmi #1', 'hdmi #2'],
});

await sequelize.close(console.log('Połączenie z bazą danych zamknięte'));
