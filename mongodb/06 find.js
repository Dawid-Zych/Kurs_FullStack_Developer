const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

async function initDB() {
	const url = 'mongodb://127.0.0.1:27017';
	let client = null;

	try {
		client = await new MongoClient(url);
		return client;
	} catch (err) {
		console.log(err);
	}
}

async function findStudents(client, name, resultsLimit) {
	try {
		const data = client.db('schooldbtest').collection('students').find({ name }).limit(resultsLimit);

		const results = await data.toArray();

		if (results.length > 0) {
			console.log(`Found ${results.length} data:`);

			results.forEach((result, i) => {
				console.log(result);
			});

			return results;
		} else {
			return null;
		}
	} catch (err) {
		console.log(err);
	}
}

async function main() {
	let client = null;

	try {
		client = await initDB();
		const students = await findStudents(client, 'Asia', 5);
	} catch (err) {
		console.log(err);
	} finally {
		await client.close();
	}
}

main();
