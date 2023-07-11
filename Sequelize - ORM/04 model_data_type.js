import { DataTypes, Sequelize } from 'sequelize';

const sequelize = new Sequelize('test', 'root', '', {
	host: 'localhost', // | 'sqlite' | 'postgres' | 'mssql'
	dialect: 'mysql',
	decimalNumbers: true,
});

try {
	await sequelize.authenticate();
	console.log('Connected to database.');
} catch (error) {
	console.error('Unable to connect to database:', error);
}

const Truck = sequelize.define(
	'Truck',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		vin: {
			type: Sequelize.UUID, // universal uniq id
			defaultValue: Sequelize.UUIDV4,
		},
		brand: {
			type: DataTypes.STRING(12),
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING(24),
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT, //max 16mln znaków
			allowNull: true,
		},
		horsePower: {
			type: DataTypes.DECIMAL(5, 2), // liczba która ma 5 cyfr i 2 miejsca po przecinku 123.45
			allowNull: true,
		},
		topSpeed: {
			type: DataTypes.DECIMAL(5, 2),
			allowNull: true,
		},
		numDoors: {
			type: DataTypes.INTEGER(2),
			defaultValue: 2,
			allowNull: true,
		},
		isElectric: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: true,
		},
		color: {
			type: DataTypes.ENUM('white', 'red', 'blue', 'green', 'black', 'yellow'),
			allowNull: false,
			defaultValue: 'blue',
		},
		realeaseDate: {
			type: DataTypes.DATE,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			allowNull: false,
		},
		lastMechanicCheck: {
			type: DataTypes.DATEONLY,
			allowNull: true,
		},
		customOptions: {
			type: DataTypes.JSON,
			allowNull: true,
		},
	},
	{
		underscored: true /* customOption => custom_options  - podajemy dodatkowe opcje w obiekcie, snake_case */,
	}
);

/* sprawdzamy czy mamy nasza bazę danych */
await sequelize
	.sync()
	.then(() => {
		console.log('Truck table created successfully!');
	})
	.catch(error => {
		console.log('Error when creating table: ', error);
	});

/* zapis danych według tego modelu */

await Truck.create({
	brand: 'Kenworth',
	name: 'T800',
	description: 'Most popular truck in USA',
	horsePower: 305.56,
	topSpeed: 130.23,
	isElectric: false,
	realeaseDate: new Date(2020, 1, 5, 17, 56, 23),
	lastMechanicCheck: new Date(2023, 2, 12),
	customOptions: JSON.stringify({
		leatherSeats: true,
		extendedCabin: true,
	}),
});

await sequelize.close();
