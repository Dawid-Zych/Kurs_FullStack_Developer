// #4 Zadanie z delete

/*
    Zadanie
    1. Połącz się z bazą "trainingdb" oraz kolekcją "students"
    2. Dodaj funkcję generateRandomStudent() która utworzy losowego studenta z danymi:
       name: dowolne żeńskie imię, przynajmniej jedno z ośmiu
       surname: dowolne nazwisko żeńskie, przynajmniej jedno z trzech
       age: dowolny wiek z zakresu 18 - 50
       city: dowolne z kilku polskich miast
       Warto stworzyć funkcję pomocniczą która zwróci losowy element z tablicy używając 
       Math.random(), pamiętaj o zaokrągleniu liczby z Math.floor() 
    3. Napisz funkcję getStudents(collection, options = {}, resultsLimit = 5), jako filtr
       przyjmiesz obiekt options po którym baza zwróci wyniki ze względu na zapisane w nim
       właściwości
    4. Dodaj funkcję updateStudent(collection, options, updateFields), aktualizuje jeden 
       rekord ze względu na obiekt options jako filtr
    5. Dodaj funkcję updateStudents(collection, options, updateFields), aktualizuje studentów
    6. Napisz funkcję deleteStudents(collection, options), kasuje wiele elementów 
       z użyciem metody deleteMany()
    7. Sprawdź czy są jacyś studenci w bazie, jeśli ich nie ma to 
       dodaj 20 losowych studentów do kolekcji z generateRandomStudent()
    8. Wywołaj funkcję deleteStudents() do skasowania studentek o imieniu np. Kasia, pokaż
       ilość skasowanych elementów w bazie. 
    9. Wywołaj getStudents() do pobrania maksymalnie 100 studentów, pokaż ilość pobranych
       rekordów z bazy
    10. Wywołaj getStudents() z options { "age": { $gt: 30 } } pokaż ilość rekordów z bazy
*/

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

function getRandomElFromArr(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomStudent() {
	const namesArr = ['Ania', 'Ola', 'Kasia', 'Ania', 'Basia', 'Zosia', 'Zuzanna', 'Kinga', 'Jola'];
	const surnameArr = ['Kowalska', 'Adamska', 'Zuzińska', 'Barska', 'Kasińska'];
	const age = 18 + Math.floor(Math.random() * (50 - 18));
	const cityArr = ['Warszawa', 'Poznań', 'Łódź', 'Kraków', 'Gdańsk', 'Szczecin'];

	return {
		name: getRandomElFromArr(namesArr),
		surname: getRandomElFromArr(surnameArr),
		age: age,
		city: getRandomElFromArr(cityArr),
	};
}

async function addDataToDB(client) {
	try {
		const db = client.db('trainingdb');
		const collection = db.collection('students');

		const students = [];

		for (let i = 0; i < 20; i++) {
			students.push(generateRandomStudent());
		}

		const result = await collection.insertMany(students, { ordered: true });
		console.log('Num saved students:', result.insertedCount);
	} catch (err) {
		console.error(err);
	}
}

async function getStudents(collection, options = {}, resultsLimit = 5) {
	try {
		const cursor = collection.find(options).limit(resultsLimit);
		const results = await cursor.toArray();

		if (results.length > 0) {
			console.log('Found num students:', results.length);
			return results;
		}
	} catch (err) {
		console.error(err);
	}

	return null;
}

async function updateStudent(collection, options, updateFields) {
	await collection.updateOne(options, { $set: updateFields });
}

async function updateStudents(collection, options, updateFields) {
	await collection.updateMany(options, { $set: updateFields });
}

async function deleteStudents(collection, options) {
	return await collection.deleteMany(options);
}

async function main() {
	let client = null;

	try {
		client = await initDB();
		const collection = client.db('trainingdb').collection('students');

		const studentsData = await collection.find({}).toArray();
		if (studentsData.length == 0) await addDataToDB(client);

		let result = await deleteStudents(collection, { name: 'Kasia' });
		console.log('Deleted students num:', result.deletedCount);

		const students = await getStudents(collection, {}, 100);
		if (students) {
			console.log('Number of students in db:', students.length);
		}

		const data = await getStudents(collection, { age: { $gt: 30 } }, 100);
		if (data) {
			console.log('Number of students with age above 30: ', data.length);
		}
	} catch (err) {
		console.error(err);
	} finally {
		if (client) client.close();
	}
}

main();
