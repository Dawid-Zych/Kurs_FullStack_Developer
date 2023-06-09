/*  
    1. Napisz funkcję asynchroniczną insertOneOrder(order) która zapisze do tabeli 
       orders zamówienie usera czyli user_id i amount. Zapisz zamówienie do bazy 
       i zwróć order z id.
    2. Dodaj order z kwotą 55 dla usera o id 1
    3. Stwórz asynchroniczną funkcję getOrdersByUserId(user_id) która zwróci
       zamówienie ze względu na przekazany id.
    4. Wyświetl zamówienia dla usera o id 1 
*/

import mysql from "mysql2/promise"; 
const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
}); 

await connection.connect();


async function insertOneOrder(order) {
    const sql = "INSERT INTO orders (user_id, amount) VALUES(?, ?)";

    const [result] = await connection.query(sql, [order.user_id, order.amount]);

    return { ...order, id: result.insertId};
}

const orderDb = await insertOneOrder({
    user_id: 1,
    amount: 55
});

console.log(orderDb);


async function getOrdersByUserId(user_id) {
    const sql = "SELECT * FROM orders WHERE user_id = ?";

    const [result] = await connection.query(sql, [user_id]);
    return result;
}

const orders = await getOrdersByUserId(1);
console.log("\n", orders);

await connection.close();

















