import { GradesController } from './GradesController';
import { SubjectController } from './SubjectsController';
import { SchoolsController } from './SchoolsController';
import { UsersController } from './UsersController';

const schoolsController = new SchoolsController();
const usersController = new UsersController();
const subjectController = new SubjectController();
const gradesController = new GradesController();

export { schoolsController, usersController, subjectController, gradesController };
