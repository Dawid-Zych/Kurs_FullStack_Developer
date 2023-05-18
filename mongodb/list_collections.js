const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

async function processDB() {
	const url = 'mongodb://127.0.0.1:27017';
	const client = new MongoClient(url, { monitorCommands: true });

	client.on('commandStarted', data => {
		console.log('commandStarted: ', data);
		console.log('commandSucceeded ', data);
		console.log('commandFailed: ', data);
	});
	try {
		await client.connect();

		const db = client.db('local');
		const collections = await db.listCollections().toArray();
		console.log(collections);

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
