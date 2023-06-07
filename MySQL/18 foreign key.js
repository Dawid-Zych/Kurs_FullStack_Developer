/*
    FOREIGN KEY w MySQL to nałożone ograniczenie przez programistę, które wskazuje relację
    pomiędzy tabelami w bazie danych, dzięki temu baza rozumie które tabele są ze sobą powiązane
    i może przeciwdziałać np kasowaniu wierszy, które sprawiłyby zniszczenie relacji między
    rekordami w  bazie.

    W praktyce FOREIGN KEY (klucz obcy) to pole w jednej tabeli, które wskazuje konkretne pole PRIMARY KEY
    w innej tabeli. Pole z foreign key nazywane jest dzieckiem - child a pole tabeli z primary key
    zwane jest rodzicem - parent. 
*/

import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'test_db',
});

await connection.connect();
async function createTables() {
	// tabela rodzic companycustomers
	const customersSql = `
        CREATE TABLE IF NOT EXISTS companycustomers (
            id int NOT NULL AUTO_INCREMENT,
            name varchar(16) NOT NULL,
            surname varchar(16) NOT NULL,
            PRIMARY KEY(id)
        );
    `;

	await connection.query(customersSql);

	// tabela zamówień - dziecko
	const ordersSql = `
        CREATE TABLE IF NOT EXISTS shoporders (
            id int NOT NULL AUTO_INCREMENT,
            amount DECIMAL(6,2) NOT NULL,
            PRIMARY KEY(id),
            companycustomer_id int,
            FOREIGN KEY (companycustomer_id) REFERENCES companycustomers(id)
        );
    `;

	await connection.query(ordersSql);
}

await createTables();

async function insertCompanyCustomer(companycustomer) {
	const sql = ` INSERT INTO companycustomers (name, surname) VALUES (?,?) `;
	const [result] = await connection.query(sql, [companycustomer.name, companycustomer.surname]);
	return { ...companycustomer, id: result.insertId };
}

const customer1 = await insertCompanyCustomer({
	name: 'Kasia',
	surname: 'Kowalska',
});

async function insertShopOrder(shopOrder) {
	const sql = ` INSERT INTO shoporders (amount, companycustomer_id) VALUES (?, ?)`;
	const [result] = await connection.query(sql, [shopOrder.amount, shopOrder.companycustomer_id]);
	return { ...shopOrder, id: result.insertId };
}

const shopOrder1 = await insertShopOrder({
	amount: 100.12,
	companycustomer_id: customer1.id,
});

const shopOrder2 = await insertShopOrder({
	amount: 243.42,
	companycustomer_id: customer1.id,
});

await connection.close();
