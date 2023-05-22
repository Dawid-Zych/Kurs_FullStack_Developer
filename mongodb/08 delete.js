
const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

async function initDB() {
    const url = "mongodb://127.0.0.1:27017";
    let client = null;

    try {
        client = await new MongoClient(url);
        return client;
    } catch (err) {
        console.log(err);
    }
}

async function addDataToDB(client) {
    try {
        const db = client.db("carstestdb");
        let collection = db.collection("cars");

        const cars = [
            { brand: "Ford", name: "Mustang", year: 1967 },
            { brand: "Dodge", name: "Charger", year: 1970 },
            { brand: "Dodge", name: "Viper", year: 1997 }
        ];

        const result = await collection.insertMany(cars, {ordered: true});
        console.log(`${result.insertedCount} cars were saved`);
    } catch (err) {
        console.log(err);
    }
}


async function showCars(collection, options = {}, resultsLimit = 5) {
    try {
        let cursor = collection.find(options).limit(resultsLimit);
        let results = await cursor.toArray();

        if (results.length > 0) {
            console.log(`Found ${results.length} listing(s):`);

            results.forEach( (result, i) => {
                console.log(result);
            } );

            return results;
        }

    } catch (err) {
        console.log(err);
    }

    return null;
}


async function updateCarsByName(collection, name, updateFields) {
    await collection.updateMany( {name}, { $set: updateFields } );
}

async function updateCarByName(collection, name, updateFields) {
    await collection.updateOne( {name}, { $set: updateFields } );
}

async function deleteCarsByName(collection, name) {
    return await collection.deleteMany({name});
}


async function main() {
    let client = null;

    try {
        client = await initDB();
        //await addDataToDB(client);
        const collection = client.db("carstestdb").collection("cars");

        let result = await deleteCarsByName(collection, "Mustang");
        console.log(result);
        console.log(`Deleted ${result.deletedCount} cars`);

        const cars = await showCars(collection, {}, 10);

    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

main();