
// 2 find_challenge.js

/*
    Zadanie
    1. Połącz się z bazą danych "trainingdb" z użyciem osobnej asynchronicznej funkcji 
       initDb() oraz try catch w celu złapania potencjalnych błędów
    2. Dodaj asynchroniczną funkcję findCars(client, brand, resultsLimit) która
       zwróci samochody z kolekcji "cars" ze względu na przekazany brand oraz limit
       zwracanych rekordów z bazy. Sprawdź ile rekordów zostało odczytanych
       i pokaż je w konsoli, zwróć z funkcji tablicę aut. Pamiętaj aby uzyć try catch.
    3. Wywołaj findCars() aby odnaleźć 2 rekordy samochodów z brand jako "Ford" lub
       inny jeśli jest to potrzebne. Użyj try, catch i finally (zakończ połączenie
       z bazą z metodą close()).
*/
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

async function findCars(client, brand, resultsLimit) {
    try {
        const data = client.db("trainingdb")
        .collection("cars")
        .find({brand})
        .limit(resultsLimit);

        const results = await data.toArray();

        if (results.length > 0) {
            console.log("Found: ", results.length, "cars");

            results.forEach( (result, i) => {
                console.log(result);
            });

            return results;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
    }
}

async function main() {
    let client = null;

    try {
        client = await initDB();
        const cars = await findCars(client, "Ford", 2);
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

main();


