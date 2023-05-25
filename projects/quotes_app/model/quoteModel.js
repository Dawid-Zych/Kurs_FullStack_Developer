const MongoSingleton = require('../data/mongoDBsingleton');
const ObjectId = require('mongodb').ObjectId;

function saveAll(quotes) {
	return new Promise(async (resolve, reject) => {
		const collection = await MongoSingleton.getCollection();
		const result = await collection.insertMany(quotes);

		if (result.insertedCount) {
			resolve(result);
		} else {
			reject("Couldn't save quotes.");
		}
	});
}

function getAll() {
	return new Promise(async (resolve, reject) => {
		const collection = await MongoSingleton.getCollection();
		const cursor = await collection.find();
		const results = await cursor.toArray();

		if (results.length > 0) {
			console.log(`Zostało pobranych ${results.length} elementów`);
			resolve(results);
		} else {
			reject("Couldn't get quotes.");
		}
	});
}

function getById(id) {
	return new Promise(async (resolve, reject) => {
		const collection = await MongoSingleton.getCollection();
		const result = await collection.findOne({ _id: new ObjectId(id) });

		if (result) {
			console.log(`Został pobrany plik ${result}`);
			resolve(result);
		} else {
			reject("Couldn't get quote by Id." + id);
		}
	});
}

function deleteById(id) {
	return new Promise(async (resolve, reject) => {
		const collection = await MongoSingleton.getCollection();
		const result = await collection.deleteOne({ _id: new ObjectId(id) });

		if (result && result.deletedCount > 0) {
			resolve(result);
		} else {
			reject("Can't delete quote by id" + id);
		}
	});
}

function updateById(data) {
	return new Promise(async (resolve, reject) => {
		const collection = await MongoSingleton.getCollection();
		let updatefiles = {
			quote: data.quote,
			author: data.author,
		};
		const result = await collection.updateOne({ _id: new ObjectId(data._id) }, { $set: updatefiles });
		if (result && result.matchedCount > 0) {
			resolve(result);
		} else {
			reject("Can't update quote by id");
		}
	});
}

function insertOne(quote) {
	return new Promise(async (resolve, reject) => {
		const collection = await MongoSingleton.getCollection();
		const result = await collection.insertOne(quote);

		if (result && result.insertedId) {
			resolve(result);
		} else {
			reject("Can't insert new quote");
		}
	});
}
/*  MOJA FUNKCJA */
function addQuote() {
	return new Promise(async function (resolve, reject) {
		const collection = await MongoSingleton.getCollection();
		const url = 'https://api.chucknorris.io/jokes/random';

		try {
			const response = await fetch(url);
			const data = await response.json();
			console.log(data.id);
			let obj = {
				quote: data.value,
				author: 'Chuck Norris',
			};
			const expistingQuote = await collection.findOne({ quote: obj.quote });
			if (expistingQuote === null) {
				await collection.insertOne(obj);

				console.log('dodano nowy wpis!');
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
