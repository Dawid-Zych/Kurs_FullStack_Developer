const { MongoClient } = require('mongodb');

module.exports = (function () {
	const url = 'mongodb://127.0.0.1:27017';
	let client;
	let db;
	let collection;

	console.log('Inicjalizacja połączenia z bazą danych');

	async function getInstance() {
		if (client) return client;

		try {
			client = new MongoClient(url);
			await client.connect();

			console.log('Połączono z bazą danych');
			db = client.db('quotesdb');
			collection = db.collection('quotes');

			return client;
		} catch (error) {
			console.error('Błąd podczas łączenia z bazą danych:', error);
			throw error;
		}
	}

	async function getDB() {
		try {
			if (!db) await getInstance();
			return db;
		} catch (error) {
			console.error('Błąd podczas pobierania bazy danych:', error);
		}
	}

	async function getCollection() {
		try {
			if (!collection) await getInstance();
			return collection;
		} catch (error) {
			console.error('Błąd podczas pobierania kolekcji:', error);
			throw error;
		}
	}

	return {
		getInstance,
		getDB,
		getCollection,
	};
})();
