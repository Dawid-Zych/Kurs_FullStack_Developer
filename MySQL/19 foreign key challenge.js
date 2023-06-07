/*  
    FOREIGN KEY w MySQL to nałożone ograniczenie przez programistę, które wskazuje relację
    pomięzy tabelami w bazie danych, dzięki temu baza rozumie które tabele są ze sobą powiązane
    i może przeciwdziałać np kasowaniu wierszy, które sprawiłyby zniszczenie relacjami między
    rekordamiw  bazie.

    W praktyce FOREIGN KEY to pole w jednej tabeli, które wskazuje konkretne pole PRIMARY KEY
    w innej tabeli. Pole z foreign key nazywane jest dzieckiem - child a pole tabeli z primary key
    zwane jest rodzicem - parent. 

    Zadanie:
    1. Stwórz tabelę schoolstudents z polami:, id, name, surname. PRIMARY KEY to id 
       Tabela będzie rodzicem dla tabeli schoolgrades w której będą oceny uczniów.
    2. Utwórz tabelę schoolgrades z polami:
       - id
       - subject  -VARCHAR(16)
       - grade - DECIMAL(4,2)
       - schoolstudent_id jako int
       - klucz obcy dla schoolstudent_id który wskazuje na schoolstudents(id)
    3. Stwórz jednego studenta i dodaj mu dwie oceny
*/




import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test_db" // UWAGA TEST_DB !
});

await connection.connect();


async function createTables() {
    const sql = `
        CREATE TABLE IF NOT EXISTS schoolstudents (
            id int NOT NULL AUTO_INCREMENT,
            name varchar(16),
            surname varchar(16),
            PRIMARY KEY(id)
        );
    `;

    await connection.query(sql);

    const sql2 = `
        CREATE TABLE IF NOT EXISTS schoolgrades (
            id int NOT NULL AUTO_INCREMENT,
            subject varchar(16) NOT NULL,
            grade DECIMAL (4,2) NOT NULL,
            PRIMARY KEY(id),
            shoolstudent_id int,
            FOREIGN KEY (shoolstudent_id) REFERENCES schoolstudents(id)
        );
    `;

    await connection.query(sql2);
}


await createTables();


async function insertSchoolStudent(schoolStudent) {
    const sql = ` INSERT INTO schoolstudents (name, surname) VALUES (?, ?) `;
    const [result] = await connection.query(sql, [schoolStudent.name, schoolStudent.surname]);
    return { ...schoolStudent, id: result.insertId };
}

const student1 = await insertSchoolStudent({
    name: "Kasia",
    surname: "Adamska"
});


async function insertSchoolGrade(schoolGrade) {
    const sql = `INSERT INTO schoolgrades (subject, grade, shoolstudent_id) VALUES (?, ?, ?) `;
    const [result] = await connection.query(sql,
                [schoolGrade.subject, schoolGrade.grade, schoolGrade.shoolstudent_id]    
    );
    return { ...schoolGrade, id: result.insertId };
}

await insertSchoolGrade({
    subject: "math",
    grade: 5.0,
    shoolstudent_id: student1.id
});

await insertSchoolGrade({
    subject: "eng",
    grade: 5.5,
    shoolstudent_id: student1.id
});





await connection.close();







