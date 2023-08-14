import { GradesController } from './GradesController.js';
import { SubjectsController } from './SubjectsController.js';
import { SchoolsController } from './SchoolsController.js';
import { UsersController } from './UsersController.js';

const schoolsController = new SchoolsController();
const usersController = new UsersController();
const subjectController = new SubjectsController();
const gradesController = new GradesController();

export { schoolsController, usersController, subjectController, gradesController };
