/*   
    Sequelize - relacje fabryki dronów, wymaga utworzenia bazy drones w mysql
*/

import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('drones', 'root', '', {
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

/*  podstawowy model adresu */
const Address = sequelize.define('Address', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		validate: {
			isInt: true,
		},
	},
	name: {
		type: DataTypes.STRING(128),
		allowNull: true,
		validate: {
			len: [1, 128],
		},
	},
	street: {
		type: DataTypes.STRING(24),
		allowNull: true,
		validate: {
			len: [1, 24],
		},
	},
	city: {
		type: DataTypes.STRING(24),
		allowNull: true,
		validate: {
			len: [1, 24],
		},
	},
	postalCode: {
		type: DataTypes.STRING(8),
		allowNull: true,
		validate: {
			len: [1, 8],
		},
	},
	country: {
		type: DataTypes.STRING(24),
		allowNull: true,
		validate: {
			len: [1, 24],
		},
	},
});

/*  model opisujący naszą fabrykę */
const DronesFactory = sequelize.define('DronesFactory', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		validate: {
			isInt: true,
		},
	},
	name: {
		type: DataTypes.STRING(128),
		allowNull: true,
		validate: {
			len: [1, 128],
		},
	},
});

/* fabryka będzie podrzędna do addresu */
Address.hasOne(DronesFactory, {
	foreignKey: 'fk_address_id',
});

DronesFactory.belongsTo(Address, {
	foreignKey: 'fk_address_id', // jest tylko w DronesFactory!
});

/* fabryka będzie produkować drony dlatego potrzebujemy kolejny model */

const Drone = sequelize.define('Drone', {
	vin: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true,
	},
	brand: {
		type: DataTypes.STRING(24),
		allowNull: true,
		validate: { len: [1, 24] },
	},
	model: {
		type: DataTypes.STRING(24),
		allowNull: true,
		validate: { len: [1, 24] },
	},
	price: {
		type: DataTypes.DECIMAL(10, 2),
		defaultValue: 0,
		allowNull: true,
		validate: {
			isDecimal: true,
			priceAboveZero(value) {
				if (value < 0) throw new Error('Price cant be negative');
			},
		},
	},
	topSpeed: {
		type: DataTypes.DECIMAL(5, 2),
		defaultValue: 10.0,
		allowNull: true,
		validate: {
			isDecimal: true,
			min: 0.0,
			max: 100.0,
		},
	},
});

DronesFactory.hasMany(Drone, {
	foreignKey: 'fk_factory_id',
});
Drone.belongsTo(DronesFactory, {
	foreignKey: 'fk_factory_id',
});

/* kolejny model opisze nam dana firme lub osobe która będzie użyta na fakturze */

const BusinessEntity = sequelize.define('BusinessEntity', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		validate: { isInt: true },
	},
	name: {
		type: DataTypes.STRING(128),
		allowNull: true,
		validate: {
			len: [1, 128],
		},
	},
	email: {
		type: DataTypes.STRING(128),
		allowNull: true,
		unique: true,
		validate: {
			len: [1, 128],
			isEmail: true,
		},
	},
});

Address.hasOne(BusinessEntity, {
	foreignKey: 'fk_address_id',
});

BusinessEntity.belongsTo(Address, {
	foreignKey: 'fk_address_id', // jest w BusinessEntity
});

/* model faktury */
const Invoice = sequelize.define('Invoice', {
	id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
		validate: {
			isInt: true,
		},
	},
	invoiceNumber: {
		type: DataTypes.STRING(128),
		allowNull: false,
		validate: {
			len: [1, 128],
		},
	},
	invoiceDate: {
		type: DataTypes.DATE,
		defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
		allowNull: true,
		validate: {
			isDate: true,
		},
	},
	netSum: {
		//netto
		comment: 'invoice amount before tax',
		type: DataTypes.DECIMAL(10, 2),
		defaultValue: 0,
		allowNull: false,
		validate: {
			isDecimal: true,
		},
	},
	tax: {
		//tax
		comment: 'tax on invoice',
		type: DataTypes.DECIMAL(10, 2),
		defaultValue: 0,
		allowNull: false,
		validate: {
			isDecimal: true,
		},
	},
	grossSum: {
		//brutto
		comment: 'invoice amount after tax',
		type: DataTypes.DECIMAL(10, 2),
		defaultValue: 0,
		allowNull: false,
		validate: {
			isDecimal: true,
		},
	},
});

Invoice.belongsTo(BusinessEntity, {
	as: 'seller',
}); // sellerId w Invoice

Invoice.belongsTo(BusinessEntity, {
	as: 'buyer',
}); // buyerId w Invoice

Invoice.hasMany(Drone, {
	foreignKey: 'fk_invoice_id',
});

Drone.belongsTo(Invoice, {
	foreignKey: 'fk_invoice_id', // klucz w Drone
});

await sequelize.sync({ force: true }); // zapisujemy wszystkie modele

const factoryAddress = await Address.create({
	street: 'Fabryczna 7',
	postalCode: '00-001',
	city: 'Wawa',
	country: 'Polska',
});

const factory = await DronesFactory.create({
	name: 'Drones Factory #1',
});

await factory.setAddress(factoryAddress);

/* -------- kupujący ------- */

const buyer1 = await BusinessEntity.create({
	name: 'Example Ltd.',
	email: Math.random() + '@example.com',
});

const buyer1Address = await Address.create({
	street: 'Wilcza 5',
	postalCode: '00-023',
	city: 'KrK',
	country: 'Polska',
});

await buyer1.setAddress(buyer1Address);

/* -------- sprzedający------- */

const seller1 = await BusinessEntity.create({
	name: 'Drones Factory WebShop Ltd.',
	email: Math.random() + '@dronesfactory.com',
});

const seller1Address = await Address.create({
	street: 'Ujazdowskie 5',
	postalCode: '32-011',
	city: 'Opole',
	country: 'Polska',
});

await seller1.setAddress(seller1Address);

/* ------------ drony ------------- */

const drone1 = await Drone.create({
	brand: 'Drone',
	model: 'X1',
	price: 600,
	topSpeed: 20,
});

await drone1.setDronesFactory(factory);

const drone2 = await Drone.create({
	brand: 'Drone',
	model: 'X2',
	price: 400,
	topSpeed: 15,
});

await drone2.setDronesFactory(factory);

const invoice = await Invoice.create({
	invoiceNumber: 'Fa 123/FXA',
	netSum: 1000,
	tax: 230,
	grossSum: 1230,
});

await invoice.setSeller(seller1);
await invoice.setBuyer(buyer1);

await drone1.setInvoice(invoice);
await drone2.setInvoice(invoice);

const factoryDb = await DronesFactory.findOne({
	include: [{ model: Address }, { model: Drone }],
});

console.log('\n', JSON.stringify(factoryDb, null, 4));

const invoiceDb = await Invoice.findOne({
	include: [
		{ model: BusinessEntity, as: 'seller', include: Address },
		{ model: BusinessEntity, as: 'buyer', include: Address },
		{ model: Drone, include: DronesFactory },
	],
});

console.log('\n', JSON.stringify(invoiceDb, null, 4));

await sequelize.close();
