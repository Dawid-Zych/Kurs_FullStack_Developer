import { sequelize } from '../utility/db.js';
import { User } from './user.model.js';
import { School } from './school.model.js';
import { Subject } from './subject.model.js';
import { Grade } from './grade.model.js';

/***  relacje School   ***/
// szkoła ma wielu użytkowników
School.hasMany(User, {
	foreignKey: 'schoolId',
});
User.belongsTo(School, {
	foreignKey: 'schoolId', // w user
});

// szkoła należy do dyrektora
School.belongsTo(User, { as: 'director' }); // powstanie directorId wskazujący na User
// school.setDirector()

/***  relacje Subject   ***/
// szkoła ma wielu przedmiotów
School.hasMany(Subject, {
	foreignKey: 'schoolId',
});
Subject.belongsTo(School, {
	foreignKey: 'schoolId', // w Subject
});

// przedmiot ma wielu studentów, ale student może mieć wiele przedmiotów, więc many to many
// tabela łącząca wielu do wielu między Subject a User
const SubjectUser = sequelize.define(
	'SubjectUser',
	{},
	{
		timestamps: false,
	}
);
Subject.belongsToMany(User, {
	through: SubjectUser,
	foreignKey: 'subjectId',
});
User.belongsToMany(Subject, {
	through: SubjectUser,
	foreignKey: 'userId',
});

Subject.belongsTo(User, { as: 'teacher' }); // powstanie teacherId, przedmiot ma nauczyciela
// metoda subject.setTeacher()

/***  relacje Grade   ***/
// przedmiot ma wiele ocen
Subject.hasMany(Grade, {
	foreignKey: 'subjectId',
});
Grade.belongsTo(Subject, {
	foreignKey: 'subjectId', // w Grade
});

// ocena wystawiona przez nauczyciela w postaci aliasu teacher z User
// powstanie teacherId w Grade, metoda grade.setTeacher()
Grade.belongsTo(User, { as: 'teacher' });

User.hasMany(Grade, {
	foreignKey: 'studentId',
});
Grade.belongsTo(User, {
	foreignKey: 'studentId', // w grade
});

Grade.belongsTo(School, {
	foreignKey: 'schoolId',
}); // schoolId w Grade

await sequelize.sync({ force: true });

export { User, School, Subject, Grade };
