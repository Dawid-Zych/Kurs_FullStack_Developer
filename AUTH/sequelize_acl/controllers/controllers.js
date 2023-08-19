import { GradesController } from './GradesController.js';
import { SubjectsController } from './SubjectsController.js';
import { SchoolsController } from './SchoolsController.js';
import { UsersController } from './UsersController.js';

import { User, School, Subject, Grade } from '../models/relationsSchema.js';

const schoolsController = new SchoolsController();
const usersController = new UsersController();
const subjectsController = new SubjectsController();
const gradesController = new GradesController();

const schoolDb = await schoolsController.createSchool({
	name: 'University #001',
	address: 'Wilcza 7, 00-001 Warszawa',
});
console.log('schooldB:', schoolDb);

const schoolDb2 = await schoolsController.createSchool({
	name: 'University #002',
	address: 'Ujazdowskie 23, 00-501 Warszawa',
});

const schoolDb3 = await schoolsController.createSchool({
	name: 'University #003',
	address: 'Krakowska 23, 30-201 Warszawa',
});

const directorDb = await usersController.createUser({
	name: 'Adam',
	surname: 'Adamski',
	email: 'director@example.com',
	password: 'test',
	role: 'director',
});

await schoolsController.setDirector(schoolDb, directorDb);
// await usersController.setSchool(directorDb, schoolDb);
console.log('directorDb:', directorDb.dataValues);

const directorWithSchoolFromDb = await User.findOne({
	where: {
		id: directorDb.id,
	},
	include: [{ model: School }],
});
console.log('Director With School:', JSON.stringify(directorWithSchoolFromDb, null, 4));

const teacherDb = await usersController.createUser({
	name: 'Alina',
	surname: 'Kowalska',
	email: 'alina@example.com',
	password: 'test',
	role: 'teacher',
});

console.log('Teacher:', teacherDb.dataValues);

const student1 = await usersController.createUser(
	{
		name: 'Kasia',
		surname: 'Kasińska',
		email: 'student1@example.com',
		password: 'test',
		role: 'student',
	},
	schoolDb
);

console.log('student1:', student1.dataValues);

const student2 = await usersController.createUser(
	{
		name: 'Karol',
		surname: 'Baksiński',
		email: 'student2@example.com',
		password: 'test',
		role: 'student',
	},
	schoolDb
);

console.log('student2:', student2.dataValues);

const subject1 = await subjectsController.createSubject(
	{
		name: 'Math',
	},
	teacherDb,
	schoolDb
);

await subjectsController.addUserToSubject(student1, subject1);
await subjectsController.addUserToSubject(student2, subject1);

const grade1 = await gradesController.createGrade(
	{
		grade: 5.0,
		description: 'great work!',
	},
	student1,
	teacherDb,
	schoolDb
);

const schoolAllData = await School.findOne({
	where: {
		id: schoolDb.id,
	},
	include: [
		{ model: User, as: 'director' },
		{ model: User },
		{
			model: Subject,
			include: [
				{
					model: User,
					include: [
						{
							model: Grade,
							include: [{ model: User, as: 'teacher' }],
						},
					],
				},
				{ model: User, as: 'teacher' },
			],
		},
	],
});

console.log('School all data', JSON.stringify(schoolAllData, null, 4));

export { schoolsController, usersController, subjectsController, gradesController };
