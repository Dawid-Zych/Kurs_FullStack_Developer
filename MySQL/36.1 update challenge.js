/*
    Zadanie z aktualizacją rekordów
    1. Stwórz asynchroniczną funkcję getAllOrders() która zwróci wszystkie zamówienia
    2. Napisz asynchroniczną funkcję getOrderById(id) która zwróci
       zamówienie ze względu na przekazane id
    3. Napisz asynchroniczną funkcję update(order) w której
       zaktualizujesz zamówienie ze względu na jego id, update 
       dotyczy pól user_id i amount
    4. Wyświetl w konsoli zamówienie z id 1 
    5. Zaktualizuj zamówienie z id 1, nadpisz user_id na 1
       oraz amount na 200. 
    6. Ponownie wyświetl w konsoli order z id 1
    7. Na koniec wyświetl wszystkie zamówienia z getAllOrders()
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
	const sql = 'SELECT * from orders';
	const [data] = await connection.query(sql);
	return data;
}

async function getOrderById(id) {
	const sql = 'SELECT * from orders WHERE id = ?';
	const [data] = await connection.query(sql, [id]);
	return data.pop();
}

async function update(order) {
	if (!order.id) return null;

	const sql = 'UPDATE orders SET user_id = ?, amount = ? WHERE id = ?';
	await connection.query(sql, [order.user_id, order.amount, order.id]);
}

console.log(await getOrderById(1));

await update({
	id: 1,
	user_id: 1,
	amount: 200,
});

console.log('\n', await getOrderById(1));
console.log('\n', await getAllOrders());

await connection.close();
