/*    
    Sequelize - relacja many to many 
    Zadanie:
    1. Stwórz model OrganisationUser opisujący użytkownika organizacji z polami: id, name, surname
    2. Dodaj drugi model TaskToDo z polami id, title, description
    3. Napisz model łączący relację many to many o nazwie UserTask
    4. Stwórz relację pomiędzy modelami w formie many to many czyli wielu użytkowników
       może być przypisanych do wielu zadań i na odwrót
    5. Stwórz dwóch użytkowników i dwa zadania. Dodaj oba zadania do pierwszego użytkownika,
       natomiast drugi użytkownik będzie miał tylko jedno z zadań. Pokaż w konsoli dane 
       obu użytkowników łącznie z ich zadaniami
*/

import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('test_db', 'root', '', {
	host: 'localhost',
	dialect: 'mysql',
	decimalNumbers: true,
});

sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch(error => {
		console.error('Unable to connect to the database: ', error);
	});

const OrganisationUser = sequelize.define(
	'OrganisationUser',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			validate: { isInt: true },
		},
		name: {
			type: DataTypes.STRING(16),
			allowNull: false,
			validate: { len: [1, 16] },
		},
		surname: {
			type: DataTypes.STRING(32),
			allowNull: false,
			validate: { len: [1, 32] },
		},
	},
	{
		timestamps: false,
	}
);

const TaskToDo = sequelize.define(
	'TaskToDo',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			validate: { isInt: true },
		},
		title: {
			type: DataTypes.STRING(128),
			allowNull: false,
			validate: { len: [1, 128] },
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		timestamps: false,
	}
);

const UserTask = sequelize.define('UserTask', {}, { timestamps: false });

try {
	OrganisationUser.belongsToMany(TaskToDo, {
		through: UserTask,
		foreignKey: 'fk_organisationuser_id',
	});
	TaskToDo.belongsToMany(OrganisationUser, {
		through: UserTask,
		foreignKey: 'fk_tasktodo_id',
	});

	await OrganisationUser.sync();
	await TaskToDo.sync();
	await UserTask.sync();

	const user1 = await OrganisationUser.create({
		name: 'Adam',
		surname: 'Kowalski',
	});

	const taskToDo1 = await TaskToDo.create({
		title: 'Task #001',
		description: 'task description...',
	});

	await user1.addTaskToDo(taskToDo1);
	await taskToDo1.addOrganisationUser(user1);

	const user2 = await OrganisationUser.create({
		name: 'Ola',
		surname: 'Adamska',
	});

	const taskToDo2 = await TaskToDo.create({
		title: 'Task #002',
		description: 'task description...',
	});

	await user2.addTaskToDo(taskToDo2);
	await taskToDo2.addOrganisationUser(user2);

	await user1.addTaskToDo(taskToDo2);
	await taskToDo2.addOrganisationUser(user1);

	const user1Db = await OrganisationUser.findByPk(user1.dataValues.id, {
		include: [{ model: TaskToDo }],
	});
	console.log('\nuser1Db:', JSON.stringify(user1Db, null, 4));

	const user2Db = await OrganisationUser.findByPk(user2.dataValues.id, {
		include: [{ model: TaskToDo }],
	});
	console.log('\nuser2Db:', JSON.stringify(user2Db, null, 4));
} catch (err) {
	console.log(err);
}

await sequelize.close();
