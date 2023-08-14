import { Grade } from '../models/relationsSchema.js';

export class GradesController {
	async getAll() {
		return await Grade.findAll({});
	}

	async createGrade(gradeData, studentDb, teacherDb, schoolDb) {
		const gradeDb = await Grade.create({
			...gradeData,
		});

		if (studentDb) {
			await gradeDb.setUser(studentDb);
		}

		if (teacherDb) {
			await gradeDb.setTeacher(teacherDb);
		}

		if (schoolDb) {
			await gradeDb.setSchool(schoolDb);
		}

		return gradeDb;
	}

	async getById(id) {
		return await Grade.findByPk(id);
	}

	async updateById(id, gradeData) {
		const updatedGrade = await Grade.update(
			{
				...gradeData,
			},
			{
				where: { id },
			}
		);

		return updatedGrade;
	}
}
