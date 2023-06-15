/*  
    Zadanie:
    1. Napisz funkcję getOrdersWithIdBetween(idFrom, idTo) która  
       pozwoli na pobranie zamówień z id z zakresu od 3 do 10
       Wyświetl zwrócone zamówienia z showOrders() w konsoli
    2. Zapisz funkcję getOrdersWithIdNotBetween(idFrom, idTo)
       która zwróci zamówienia z id które nie są z zakresu od 3 do 10
    3. Napisz funkcję asynchroniczną getOrdersCreatedBetween(dateFrom, 
       dateTo) dzięki której zwrócisz zamówienia z datami created
       z zakresu dateFrom do dateTo. Zapisz pomocnicze funkcje
       do utworzenia prawidłowej daty w formacie SQL. 
       Wyświetl zamówienia które pojawiły się w ostatnich 10 dniach
*/
import mysql from 'mysql2/promise';
const connection = await mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'test',
});

await connection.connect();

function showOrders(info, dbRows) {
	console.log(info);

	dbRows.forEach(r => {
		console.log('id:', r.id, 'user_id:', r.user_id, r.amount, r.created);
	});
}

async function getOrdersWithIdBetween(idFrom, idTo) {
	const sql = 'SELECT * FROM orders WHERE id BETWEEN ? and ? ';
	const [rows] = await connection.query(sql, [idFrom, idTo]);
	return rows;
}
showOrders('Orders with ids between 3 and 10:', await getOrdersWithIdBetween(3, 10));

async function getOrdersWithIdNotBetween(idFrom, idTo) {
	const sql = 'SELECT * FROM orders WHERE id NOT BETWEEN ? and ? ';
	const [rows] = await connection.query(sql, [idFrom, idTo]);
	return rows;
}
showOrders('Orders with ids not between 3 and 10:', await getOrdersWithIdNotBetween(3, 10));

function getMySQLDateStr(date) {
	// 2023-02-15 06:11:53
	return (
		date.getFullYear() +
		'-' +
		(date.getMonth() + 1).toString().padStart(2, '0') + // 2 na 02
		'-' +
		date.getDate().toString().padStart(2, '0') +
		' ' +
		date.getHours().toString().padStart(2, '0') +
		':' +
		date.getMinutes().toString().padStart(2, '0') +
		':' +
		date.getSeconds().toString().padStart(2, '0')
	);
}

function addDaysToDate(date, days) {
	return new Date(date.getTime() + 60 * 60 * 24 * 1000 * days);
}

const dateFrom = addDaysToDate(new Date(), -10);
const dateTo = addDaysToDate(new Date(), 1);

async function getOrdersCreatedBetween(dateFrom, dateTo) {
	const dateFromStr = getMySQLDateStr(dateFrom);
	const dateToStr = getMySQLDateStr(dateTo);
	const sql = 'SELECT * FROM orders WHERE created BETWEEN ? and ? ';
	const [rows] = await connection.query(sql, [dateFromStr, dateToStr]);
	return rows;
}
showOrders('Orders with created between dates:', await getOrdersCreatedBetween(dateFrom, dateTo));

await connection.close();
