/*    
    Sequelize - relacja one to many 
    Zadanie:
    1. Napisz model Supermarket z id oraz name
    2. Stwórz model ShopProduct z id, name i price
    3. Stwórz relację one to many, gdzie supermarket ma wiele produktów
    4. Utwórz instancję supermarketu i dwa produkty z nim powiązane, zapisz je do bazy
    5. Odczytaj supermarket z danymi produktów i pokaż je w konsoli
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

const Supermarket = sequelize.define(
	'Supermarket',
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			validate: { isInt: true },
		},
		name: {
			type: DataTypes.STRING(24),
			allowNull: false,
			validate: {
				len: [1, 24],
			},
		},
	},
	{
		timestamps: false,
	}
);

const ShopProduct = sequelize.define(
	'ShopProduct',
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			validate: { isInt: true },
		},
		name: {
			type: DataTypes.STRING(24),
			allowNull: false,
			validate: {
				len: [1, 24],
			},
		},
		price: {
			type: DataTypes.DECIMAL(6, 2),
			allowNull: false,
			validate: { isDecimal: true },
		},
	},
	{
		timestamps: false,
	}
);

try {
	Supermarket.hasMany(ShopProduct, {
		foreignKey: 'fk_supermarket_id',
	});
	ShopProduct.belongsTo(Supermarket, {
		foreignKey: 'fk_supermarket_id', // klucz w ShopProduct!
	});

	await Supermarket.sync();
	await ShopProduct.sync();

	const supermarket = await Supermarket.create({
		name: 'Supermarket 001',
	});

	const product1 = await ShopProduct.create({
		name: 'radio',
		price: 200.0,
	});
	await product1.setSupermarket(supermarket);

	const product2 = await ShopProduct.create({
		name: 'bicycle',
		price: 1000.0,
		fk_supermarket_id: supermarket.id,
	});
	//await product2.setSupermarket(supermarket);

	const supermarketDb = await Supermarket.findByPk(supermarket.dataValues.id, {
		include: [
			{
				model: ShopProduct,
			},
		],
	});

	console.log(JSON.stringify(supermarketDb, null, 4));
} catch (err) {
	console.log(err);
}

await sequelize.close();
