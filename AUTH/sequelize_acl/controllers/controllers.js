import { GradesController } from './GradesController.js';
import { SubjectsController } from './SubjectsController.js';
import { SchoolsController } from './SchoolsController.js';
import { UsersController } from './UsersController.js';

import { User, School, Subject, Grade } from '../models/relationsSchema.js';

const schoolsController = new SchoolsController();
const usersController = new UsersController();
const subjectController = new SubjectsController();
const gradesController = new GradesController();

const schoolDb = await schoolsController.createSchool({
	name: 'University #001',
	address: 'Wilcza 7, 00-001 Warszawa',
});
console.log('schooldB:', schoolDb);

const directorDb = await usersController.createUser({
	name: 'Adam',
	surname: 'Adamski',
	email: Math.random() + '@example.com',
	password: 'test',
	role: 'director',
});

await schoolsController.setDirector(schoolDb, directorDb);
await usersController.setSchool(directorDb, schoolDb);
console.log('directorDb:', directorDb.dataValues);

const directorWithSchoolFromDb = await User.findOne({
	where: {
		id: directorDb.id,
	},
	include: [{ model: School }],
});

console.log('director With School:', JSON.stringify(directorWithSchoolFromDb, null, 4));

export { schoolsController, usersController, subjectController, gradesController };
