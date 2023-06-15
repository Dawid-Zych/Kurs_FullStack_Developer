import mysql from 'mysql2/promise';
const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'test' });

await connection.connect();

/* 
# LEFT JOIN połączy tabele z perspektywy users do którzych wrzuci rekordy z orders
# ale jeśli nie ma order dla user to zostaną puste pola z NULL
SELECT users.id, users.name, users.surname, orders.id, orders.user_id, orders.amount, orders.created FROM users LEFT JOIN orders ON users.id = orders.user_id ORDER BY users.surname
*/

async function getUsersWithOrders() {
	const sql = `
        SELECT users.id, users.name, users.surname,
        orders.id as order_id, orders.user_id as order_user_id, orders.amount, orders.created
        FROM users LEFT JOIN orders On users.id = orders.user_id ORDER BY users.id 
    `;

	const [rows] = await connection.query(sql);
	return rows;
}

const users = await getUsersWithOrders();
console.log(users);
