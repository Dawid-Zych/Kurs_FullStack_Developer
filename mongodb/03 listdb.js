const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

async function processDB() {
	const url = 'mongodb://127.0.0.1:27017';
	const client = new MongoClient(url);

	try {
		await client.connect();

		const dbList = await client.db().admin().listDatabases();
		console.log('Databases: ');
		dbList.databases.forEach(db => console.log(db.name));
	} catch (error) {
		console.log('Error: ' + error);
	} finally {
		await client.close();
	}
}

processDB();
