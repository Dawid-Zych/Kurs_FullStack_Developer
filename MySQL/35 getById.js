
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
});


await connection.connect();

async function getAll() {
    const query = "SELECT * FROM users";
    const [data] = await connection.query(query);
    return data;
}

//const data = await getAll();
//console.log("data:", data);


async function insertOne(user) {
    const query = `
        INSERT INTO users (name, surname, age, bio, address)
        VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await connection.query(
        query,
        [user.name, user.surname, user.age,
         user.bio, user.address]
    );

    return { ...user, id: result.insertId };
}

const userDb = await insertOne({
    name: "Alina",
    surname: "Kowalska",
    age: 30,
    bio: "Programistka",
    address: "Wilcza 111, Wawa"
});

console.log(userDb);



async function getById(id) {
    const query = "SELECT * FROM users where id = ?";
    const [data] = await connection.query(query, [id]);

    return data.pop();
}

console.log( await getById(1) );





