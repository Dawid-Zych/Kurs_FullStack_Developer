const MongoSingleton = require('../data/mongoDBsingleton');

const ObjectId = require('mongodb').ObjectId;

function saveAll(quotes) {
	return new Promise(async (resolve, reject) => {
		try {
			const collection = await MongoSingleton.getCollection();
			const result = await collection.insertMany(quotes);

			if (result.insertedCount) {
				resolve(result);
			} else {
				reject("Couldn't save quotes.");
			}
		} catch (error) {
			reject(error);
		}
	});
}

function getAll() {
	return new Promise(async (resolve, reject) => {
		try {
			const collection = await MongoSingleton.getCollection();
			const cursor = await collection.find();
			const results = await cursor.toArray();

			if (results.length > 0) {
				console.log(`Zostało pobranych ${results.length} elementów`);
				resolve(results);
			} else {
				reject("Couldn't get quotes.");
			}
		} catch (error) {
			reject(error);
		}
	});
}

function getById(id) {
	return new Promise(async (resolve, reject) => {
		try {
			const collection = await MongoSingleton.getCollection();
			const result = await collection.findOne({ _id: new ObjectId(id) });
			if (result) {
				console.log(`Został pobrany plik`);
				resolve(result);
			} else {
				reject("Couldn't get quote by Id: " + id);
			}
		} catch (error) {
			reject(error);
		}
	});
}

function deleteById(id) {
	return new Promise(async (resolve, reject) => {
		try {
			const collection = await MongoSingleton.getCollection();
			const result = await collection.deleteOne({ _id: new ObjectId(id) });

			if (result && result.deletedCount > 0) {
				resolve(result);
			} else {
				reject("Can't delete quote by id: " + id);
			}
		} catch (error) {
			reject(error);
		}
	});
}

function updateById(data) {
	return new Promise(async (resolve, reject) => {
		try {
			const collection = await MongoSingleton.getCollection();
			let updateFiles = {
				quote: data.quote,
				author: data.author,
			};
			console.log(data);
			const result = await collection.updateOne({ _id: new ObjectId(data._id) }, { $set: updateFiles });
			if (result && result.modifiedCount > 0) {
				resolve(result);
			} else {
				reject('Nic nie zmieniono w cytacie');
			}
		} catch (error) {
			reject(error);
		}
	});
}

function insertOne(quote) {
	return new Promise(async (resolve, reject) => {
		try {
			const collection = await MongoSingleton.getCollection();
			const result = await collection.insertOne(quote);

			if (result && result.insertedId) {
				resolve(result);
			} else {
				reject("Can't insert new quote");
			}
		} catch (error) {
			reject(error);
		}
	});
}
/*  MOJA FUNKCJA */

function addQuote() {
	return new Promise(async (resolve, reject) => {
		try {
			const collection = await MongoSingleton.getCollection();
			const url = 'https://api.chucknorris.io/jokes/random';

			const response = await fetch(url);
			const data = await response.json();
			console.log(data);
			let obj = {
				quote: data.value,
				author: 'Chuck Norris',
			};
			const existingQuote = await collection.findOne({ quote: obj.quote });
			if (existingQuote === null) {
				await collection.insertOne(obj);

				console.log('Dodano nowy wpis!');
				resolve(obj);
			} else {
				reject('Nie udało się pobrać cytatu');
			}
		} catch (error) {
			reject(error);
		}
	});
}

/* ################################################  */
module.exports = { getAll, saveAll, getById, addQuote, deleteById, updateById, insertOne };
