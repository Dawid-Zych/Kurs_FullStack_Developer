const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

async function processDB() {
	const url = 'mongodb://127.0.0.1:27017';
	const client = new MongoClient(url);

	try {
		await client.connect();

		const db = client.db('schooldbtest');

		let collection = db.collection('students');
		await collection.insertOne({ name: 'Asia', email: 'asia@example.com' });
		await collection.insertOne({ name: 'Kasia', email: 'kasia@example.com' });

		const students = [
			{ name: 'Marek', email: 'marek@example.com' },
			{ name: 'Dawid', email: 'dawid@example.com' },
			{ name: 'Kamil', email: 'kamil@example.com' },
		];
		const options = { ordered: true };

		const result = await collection.insertMany(students, options);

		console.log(`${result.insertedCount} students were saved`);
	} catch (error) {
		console.log('Error: ' + error);
	} finally {
		await client.close();
	}
}

processDB();
