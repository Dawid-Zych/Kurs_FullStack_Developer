import { Grade, School, Subject, User } from '../models/relationsSchema.js';
import { Op } from 'sequelize';
import { sequelize } from '../utility/db.js';

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
							required: false, // też userzy bez oceny
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
				where: {
					id,
				},
			}
		);

		return updatedSubject;
	}

	async getTeacherSubjects(teacherId) {
		return await Subject.findAll({
			where: {
				teacherId: teacherId,
			},
			include: {
				model: User,
				include: [{ model: School }],
			},
		});
	}

	async getStudentsSubjects(studentId) {
		return await Subject.findAll({
			include: {
				model: User,
				where: {
					id: studentId,
				},
				include: [
					{ model: School },
					{
						model: Grade,
						required: false,
						where: {
							studentId: studentId,
							subjectId: {
								[Op.eq]: sequelize.col('Subject.id'), // bez tego przedmioty moglyby być przemieszane z przedmiotami
							},
						},
					},
				],
			},
		});
	}

	async getSubjectGrades(subjectId) {
		return await Grade.findAll({
			where: {
				subjectId: subjectId,
			},
			include: [
				{
					model: User,
					required: false,
					include: [{ model: School }],
				},
			],
		});
	}
}
