/*
    1. Połącz się z bazą "trainingdb" i utwórz kolekcję smartphones
    2. Dodaj 4 obiekty telefonów z brand:apple name:iphone i kolorami: red, white, black, green
    3. Napisz asynchroniczną funkcję showSmartphones(collection, options = {}, resultsLimit = 10)
       która wyszuka telefony ze względu na właściwości przekazane w obiekcie options i ograniczy
       wynik domyślnie do 10 rekordów. Sprawdź czy ilość rekordów jest większa od 0 i pokaż je 
       w konsoli, na koniec funkcji zwróć wyniki z bazy.
    4. Dodaj asynchroniczną funkcję updateSmartphonesByName(collection, name, updateFields)
       która zaktualizuje wiele telefonów w bazie ze względu na name o pola w updateFields
       używając metody updateMany()
    5. W ten sam sposób dodaj funkcję updateSmartphoneByName(collection, name, updateFields)
       która zaktualizuje pojedyńczy rekord w bazie ze względu na name z użyciem metody updateOne()
    6. Po dodaniu telefonów do bazy zaktualizuj wszystkie rekordy z updateSmartphonesByName()
       i dodaj wszystkim właściwość model o wartości "max"
    7. Zaktualizuj jeden rekord w bazie updateSmartphoneByName() i nadpisz/dodaj następujące 
       właściwości: color:silver, screenSize:6 oraz obiekt zapisany w data z tablicą apps wraz
       z nazwami aplikacji: maps, chrome i safari
    8. Pokaż wszystkie smartfony w bazie używając metody showSmartphones()
*/
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

async function initDB() {
	const url = 'mongodb://127.0.0.1:27017';
	let client = null;

	try {
		client = new MongoClient(url);
		return client;
	} catch (err) {
		console.log(err);
	}
}

async function addDataToDB(client) {
	try {
		const db = client.db('trainingdb');
		const collection = db.collection('smartphones');

		const smartphones = [
			{ brand: 'apple', name: 'iphone', color: 'red' },
			{ brand: 'apple', name: 'iphone', color: 'white' },
			{ brand: 'apple', name: 'iphone', color: 'black' },
			{ brand: 'apple', name: 'iphone', color: 'green' },
		];

		const result = await collection.insertMany(smartphones, { ordered: true });
		console.log('Num saved smartphones:', result.insertedCount);
	} catch (err) {
		console.error(err);
	}
}

async function showSmartphones(collection, options = {}, resultsLimit = 10) {
	try {
		const cursor = collection.find(options).limit(resultsLimit);
		const results = await cursor.toArray();

		if (results.length > 0) {
			console.log('Found num:', results.length, ' elements');

			results.forEach(result => {
				console.log(result);
			});

			return results;
		}
	} catch (err) {
		console.error(err);
	}

	return null;
}

async function updateSmartphonesByName(collection, name, updateFileds) {
	await collection.updateMany({ name }, { $set: updateFileds });
}

async function updateSmartphoneByName(collection, name, updateFileds) {
	await collection.updateOne({ name }, { $set: updateFileds });
}

async function main() {
	let client = null;

	try {
		client = await initDB();
		await addDataToDB(client);
		const collection = client.db('trainingdb').collection('smartphones');

		await updateSmartphonesByName(collection, 'iphone', { model: 'max' });

		await updateSmartphoneByName(collection, 'iphone', {
			color: 'silver',
			screenSize: 6,
			data: {
				apps: ['maps', 'chrome', 'safari'],
			},
		});

		const smartphonesDb = await showSmartphones(collection, {}, 10);
	} catch (err) {
		console.error(err);
	} finally {
		client.close();
	}
}

main();
