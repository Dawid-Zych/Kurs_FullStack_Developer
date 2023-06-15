/* 
    Zadanie z LEFT JOIN
   1. Napisz asynchroniczną funkcję createParcelsTable() gdzie utworzysz tabelę parcels jeśli nie 
      istnieje z polami: id, amount z typem DECIMAL(9,2), weight jako DECIMAL(9,2), created, updated
   2. Zrób asynchroniczną funkcję insertParcel(parcel) zapisującą paczkę i zwracającą obiekt z id
   3. Napisz asynchroniczną funkcję createAddressesTable() tworzącą tabelę addresses z polami:
      id, parcel_id, type, name, surname, street, postalCode, city, created, updated
   4. Zrób asynchroniczną funkcję insertAddress(address) zapisującą adres i zwracającą obiekt z id
   5. Stwórz asynchroniczną funkcję getParcelWithAddresses() która pobierze paczki z adresami
      połączone dzięki LEFT JOIN
   6. Dodaj instancję paczki i adresy nadawcy i odbiorcy. Nadawca ma type jako "sender", a odbiorca
      ma type jako "recipient". Zapisz ten obiekt w bazie i pokaż paczki połączone z adresami
      w konsoli.
*/

import mysql from 'mysql2/promise';
const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'test' });

await connection.connect();

async function createParcelsTable() {
	const sql = `
        CREATE TABLE IF NOT EXISTS parcels (
            id int NOT NULL AUTO_INCREMENT,
            amount DECIMAL(9,2) NOT NULL,
            weight DECIMAL(9,2) NOT NULL,
            created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated DATETIME ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY(id)
        );
    `;

	await connection.query(sql).catch(err => {
		throw err;
	});
}

async function insertParcel(parcel) {
	const sql = `
        INSERT INTO parcels (amount, weight) VALUES (?, ?)
    `;

	const [result] = await connection.query(sql, [parcel.amount, parcel.weight]);

	return { ...parcel, id: result.insertId };
}

async function createAddressTable() {
	const sql = `
        CREATE TABLE IF NOT EXISTS addresses (
            id int NOT NULL AUTO_INCREMENT,
            parcel_id int NOT NULL,
            type varchar(12) NOT NULL,
            name varchar(12) NOT NULL,
            surname varchar(12) NOT NULL,
            street varchar(12) NOT NULL,
            postalCode varchar(6) NOT NULL,
            city varchar(12) NOT NULL,
            created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated DATETIME ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY(id)
        );
    `;

	await connection.query(sql).catch(err => {
		throw err;
	});
}

async function insertAddress(address) {
	const sql = `
        INSERT INTO addresses (parcel_id, type, name, surname, street, postalCode, city)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

	const [result] = await connection.query(sql, [
		address.parcel_id,
		address.type,
		address.name,
		address.surname,
		address.street,
		address.postalCode,
		address.city,
	]);
	return { ...address, id: result.insertId };
}

async function getParcelsWithAddresses() {
	const sql = `
        SELECT parcels.id, parcels.amount, parcels.weight, parcels.created as parcel_created,
        addresses.id as address_id, addresses.type, addresses.name, addresses.surname, addresses.street,
        addresses.postalCode, addresses.city, addresses.created as address_created
        FROM parcels LEFT JOIN addresses On parcels.id = addresses.parcel_id ORDER BY parcels.id
    `;

	const [rows] = await connection.query(sql);
	return rows;
}

await createParcelsTable();
await createAddressTable();

const parcelDb = await insertParcel({
	amount: 35.23,
	weight: 5.2,
});

const senderDb = await insertAddress({
	parcel_id: parcelDb.id,
	type: 'sender',
	name: 'Ola',
	surname: 'Kowalska',
	street: 'Wilcza 6',
	postalCode: '00-001',
	city: 'Warszawa',
});

const recipientDb = await insertAddress({
	parcel_id: parcelDb.id,
	type: 'recipient',
	name: 'Kasia',
	surname: 'Kowalska',
	street: 'Marszałkowska 78',
	postalCode: '00-005',
	city: 'Warszawa',
});

const parcels = await getParcelsWithAddresses();
console.log(JSON.stringify(parcels, null, 4));

await connection.close();
