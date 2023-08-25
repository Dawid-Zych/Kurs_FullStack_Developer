import { Grade, School, Subject, User } from '../models/relationsSchema.js';

export class SubjectsController {
	async getAll() {
		return await Subject.findAll({});
	}

	async createSubject(subjectData, teacherDb, schoolDb) {
		const subjectDb = await Subject.create({
			...subjectData,
		});

		if (teacherDb) {
			await subjectDb.setTeacher(teacherDb);
		}

		if (schoolDb) {
			await subjectDb.setSchool(schoolDb);
		}

		return subjectDb;
	}

	async addUserToSubject(studentDb, subjectDb) {
		await subjectDb.addUser(studentDb);
		await studentDb.addSubject(subjectDb);
	}

	async getById(id) {
		return await Subject.findByPk(id);
	}

	async getFullDataById(id) {
		return await Subject.findByPk(id, {
			include: [
				{
					model: User,
					include: [
						{ model: School },
						{
							model: Grade,
							where: {
								subjectId: id, // tylko oceny związane z przedmiotem o id
							},
						},
					],
				},
				{ model: User, as: 'teacher' },
			],
		});
	}
	async updateById(id, subjectData) {
		const updatedSubject = await Subject.update(
			{
				...subjectData,
			},
			{
				where: { id },
			}
		);

		return updatedSubject;
	}
}
