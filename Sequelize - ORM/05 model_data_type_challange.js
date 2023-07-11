/*
    Sequelize - Data Types
    Zadanie
    1. Stwórz model opisujący czasopismo - Magazine z polami:
      - id jako int auto increment oraz primary key
      - subscriberId jako UUID z domyślną wartością UUIDV4
      - title jako String z 64 znakami
      - description jako typ TEXT
      - numPages to int z 3 cyframi i domyślną wartością 70
      - price to DECIMAL(5,2) z domyślną wartością 34.99
      - isHardcover jako Boolean o domyślnej wartości false
      - type to enum z wartościami "tech", "news", "cooking", "cars", domyślna "tech"
      - publicationDate to data publikacji, domyślnie aktualny timestamp
      - advertisments ma typ json i przechowuje obiekt JavaScript z opisem na których
                      stronach jaka jest reklama
      Użyj flagi underscored jako true oraz decimalNumbers: true 
    2. Stwórz jedną instancję magazynu o dowolnej treści i zapisz ją do bazy, sprawdź
       strukturę tabeli magazines i rekord w podglądzie bazy w przeglądarce
*/

import { DataTypes, Sequelize } from 'sequelize';

const sequelize = new Sequelize('test', 'root', '', {
	host: 'localhost', // | 'sqlite' | 'postgres' | 'mssql'
	dialect: 'mysql',
});

try {
	await sequelize.authenticate();
	console.log('Connected to database.');
} catch (error) {
	console.error('Unable to connect to database:', error);
}

const Magazine = sequelize.define(
	'Magazine',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		subscribedId: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
		},
		title: {
			type: DataTypes.STRING(64),
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		numPages: {
			type: DataTypes.INTEGER(3),
			defaultValue: 70,
			allowNull: false,
		},
		price: {
			type: DataTypes.DECIMAL(5, 2),
			defaultValue: 34.99,
			allowNull: true,
		},
		isHardcover: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		type: {
			type: DataTypes.ENUM('tech', 'news', 'cooking', 'cars'),
			defaultValue: 'tech',
			allowNull: false,
		},
		publicationDate: {
			type: DataTypes.DATE,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			allowNull: false,
		},
		advertisments: {
			type: DataTypes.JSON,
			allowNull: true,
		},
	},
	{
		underscored: true,
		decimalNumbers: true,
	}
);

/* sprawdzamy czy mamy nasza bazę danych */
await sequelize
	.sync()
	.then(() => {
		console.log('Magazine table created successfully!');
	})
	.catch(error => {
		console.log('Error when creating table: ', error);
	});

/* zapis danych według tego modelu */
await Magazine.create({
	title: 'Tech news',
	description: 'Latest computer news and tech',
	numPages: 100,
	price: 29.99,
	isHardcover: 'true',
	publicationDate: new Date(),
	advertisments: JSON.stringify({
		page1: 'Computer advert #1',
		page2: 'Computer advert #2',
		page3: 'Computer advert #3',
	}),
});

await sequelize.close();
