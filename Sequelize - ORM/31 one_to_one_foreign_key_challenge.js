/*    
    Sequelize - relacja one to one z ustawionym foreign key i zagnieżdżony include
    Zadanie: 
    1. Napisz model CitySchool z id typu int oraz name
    2. Utwórz model Director z id jako UUID, name, surname
    3. Dodaj model Stamp z id i text, reprezentuje pieczątkę dyrektora
    4. Utwórz relację, gdzie Dyrektor jest zależny od szkoły z foreign key jako fk_cityschool_id
    5. Zrób relację gdzie pieczątka jest zależna od Dyrektora z FK jako fk_director_id (UUID)
    6. Utwórz instancje i połącz je ze sobą, zapisz dane do bazy
    7. Odczytaj szkołę z include który pozwoli na wczytanie dyrektora i jego pieczątki 
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

const CitySchool = sequelize.define(
	'CitySchool',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			validate: { isInt: true },
		},
		name: {
			type: DataTypes.STRING(24),
			allowNull: false,
			validate: { len: [1, 24] },
		},
	},
	{
		timestamps: false,
	}
);

const Director = sequelize.define(
	'Director',
	{
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(24),
			allowNull: false,
			validate: { len: [1, 24] },
		},
		surname: {
			type: DataTypes.STRING(24),
			allowNull: false,
			validate: { len: [1, 24] },
		},
	},
	{
		timestamps: false,
	}
);

const Stamp = sequelize.define(
	'Stamp',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			validate: { isInt: true },
		},
		text: {
			type: DataTypes.STRING(256),
			allowNull: false,
			validate: { len: [1, 256] },
		},
	},
	{
		timestamps: false,
	}
);

try {
	CitySchool.hasOne(Director, {
		foreignKey: 'fk_cityschool_id', // klucz w Dyrektorze!
	});
	Director.belongsTo(CitySchool, {
		foreignKey: 'fk_cityschool_id', // klucz w Dyrektorze!, child szkoły
	});

	Director.hasOne(Stamp, {
		foreignKey: 'fk_director_id',
	});
	Stamp.belongsTo(Director, {
		foreignKey: 'fk_director_id', // klucz będzie w Stamp!
	});

	await CitySchool.sync();
	await Director.sync();
	await Stamp.sync();

	const citySchool = await CitySchool.create({
		name: 'School 001',
	});

	const director = await Director.create({
		name: 'Ola',
		surname: 'Kowalska',
	});
	await director.setCitySchool(citySchool); // zapisany FK do citySchool

	const stamp = await Stamp.create({
		text: 'Director Stamp...',
	});
	await stamp.setDirector(director);

	const schoolDb = await CitySchool.findByPk(citySchool.dataValues.id, {
		include: [
			{
				model: Director,
				include: [Stamp],
			},
		],
	});

	console.log(JSON.stringify(schoolDb, null, 4));
} catch (err) {
	console.log(err);
}

await sequelize.close();
