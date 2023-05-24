const { MongoClient } = require('mongodb');

module.exports = (function () {
	const url = 'mongodb://127.0.0.1:27017';
	let client;
	let db;
	let collection;

	async function getInstance() {
		return new Promise(async function (resolve, reject) {
			if (client) return resolve(client);

			try {
				client = await new MongoClient(url);
				await client.connect();

				console.log('Connected to database');
				db = client.db('quotesdb');
				collection = db.collection('quotes');

				return resolve(client);
			} catch (error) {
				console.log(error);
				return reject(error);
			}
		});
	}

	async function getDB() {
		try {
			if (!db) await getInstance();
			return db;
		} catch (error) {
			console.log(error, 'Getting DB failure');
		}
	}

	async function getCollection() {
		try {
			if (!collection) await getInstance();
			return collection;
		} catch (error) {
			console.log(error, 'Getting DB failure');
		}
	}

	return {
		getInstance,
		getDB,
		getCollection,
	};
})();
