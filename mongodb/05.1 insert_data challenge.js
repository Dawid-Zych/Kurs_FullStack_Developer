/*
    Zadanie z bazą MongoDB
    1. Połącz się z mongo i utwórz bazę o nazwie "trainingdb"
    2. Dodaj kolekcję "cars"
    3. Zapisz do kolekcji cars 2 obiekty reprezentujące samochody
       z właściwościami: brand, name, color używając metody insertOne()
    4. Zapisz kolejne 2 auta w tablicy z metodą insertMany(), pokaż w konsoli
       ilość zapisanych rekordów w bazie
*/
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

async function processDB() {
	const url = 'mongodb://127.0.0.1:27017';
	const client = new MongoClient(url);

	try {
		await client.connect();
		const db = client.db('trainingdb');
		const collection = db.collection('cars');

		await collection.insertOne({
			brand: 'Ford',
			name: 'Taurus',
			color: 'green',
		});
		await collection.insertOne({
			brand: 'Ford',
			name: 'Mustang',
			color: 'red',
		});

		const cars = [
			{ brand: 'Dodge', name: 'Viper', color: 'blue' },
			{ brand: 'Dodge', name: 'Ram', color: 'red' },
		];

		const result = await collection.insertMany(cars, { ordered: true });
		console.log('Num cars saved:', result.insertedCount);
	} catch (err) {
		console.error(err);
	} finally {
		await client.close();
	}
}

processDB();
