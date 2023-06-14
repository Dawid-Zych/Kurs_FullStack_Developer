/* 
    Zadanie
    1. Stwórz asynchroniczną funkcję getAvgOrderAmount() która
       zwróci średnią kwotę zamówienia z wykorzystaniem AVG()
    2. Napisz funkcję getAvgRoundOrderAmount() która zwróci średnią
       kwotę zamówienia zaokrągloną do trzech miejsc po przecinku
    3. Napisz funkcję countOrders() która zwróci ilość zamówień w bazie
    4. Dodaj funkcję getMinOrderAmount() zwracającą minimalną 
       wartość zamówienia
    5. Stwórz funkcję sumAmount() która zwróci sumę kwot zamówień
    6. Zastosuj wszystkie funkcje i wyświetl ich wynik w konsoli
*/
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'test',
});

await connection.connect();

async function getAvgOrderAmount() {
	const sql = 'SELECT AVG(amount) as avgAmount FROM orders';
	const [rows] = await connection.query(sql);
	return rows.pop().avgAmount;
}

const avgAmount = await getAvgOrderAmount();
console.log('Avg amount:', avgAmount);

async function getAvgRoundOrderAmount() {
	const sql = 'SELECT ROUND(AVG(amount), 3) as avgRoundAmount FROM orders';
	const [rows] = await connection.query(sql);
	return rows.pop().avgRoundAmount;
}

const avgRoundAmount = await getAvgRoundOrderAmount();
console.log('Avg round amount:', avgRoundAmount);

async function countOrders() {
	const sql = 'SELECT COUNT(id) as numOrders FROM orders';
	const [rows] = await connection.query(sql);
	return rows.pop().numOrders;
}

console.log('Num orders:', await countOrders());

async function getMaxOrderAmount() {
	const sql = 'SELECT MAX(amount) as maxAmount FROM orders';
	const [rows] = await connection.query(sql);
	return rows.pop().maxAmount;
}

console.log('Max order amount:', await getMaxOrderAmount());

async function sumAmount() {
	const sql = 'SELECT SUM(amount) as sumAmount FROM orders';
	const [rows] = await connection.query(sql);
	return rows.pop().sumAmount;
}

console.log('Orders sum amount:', await sumAmount());

await connection.close();
