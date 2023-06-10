/*  
    Zadanie
    1. Napisz funkcję asynchroniczną  removeOrderById(id) która skasuje zamówienie
       ze względu na podany id
    2. Pokaż wszystkie zamówienia w konsoli
    2. Skasuj ostatnie zamówienie z bazy
    3. Pokaż ponownie wszystkie zamówienia w konsoli
*/
import mysql from 'mysql2/promise';
const connection = await mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'test',
});
await connection.connect();

async function getAllOrders() {
	const query = 'SELECT * FROM orders';
	const [data] = await connection.query(query);
	return data;
}

async function removeOrderById(id) {
	const sql = 'DELETE FROM orders where id = ? ';
	await connection.query(sql, [id]);
}

console.log('\n', await getAllOrders());

await removeOrderById(5);

console.log('\npo skasowaniu:\n', await getAllOrders());

await connection.close();
