import { School, Subject, User, Grade } from '../models/relationsSchema.js';

export class SchoolsController {
	async getAll() {
		return await School.findAll({});
	}

	async createSchool(schoolData, directorDB) {
		const schoolDb = await School.create({
			...schoolData,
		});

		if (directorDB) {
			await schoolDb.setDirector(directorDB);
		}
		return schoolDb;
	}

	async setDirector(schoolDb, directorDB) {
		if (directorDB && schoolDb) {
			await schoolDb.setDirector(directorDB);
			return true;
		}

		return false;
	}

	async getByID(id) {
		return await School.findByPk(id);
	}

	async getFullDataById(id) {
		return await School.findByPk(id, {
			include: [{ model: Subject, include: [{ model: User, as: 'teacher' }] }],
		});
	}

	async updateById(id, schoolData) {
		const updatedSchool = await School.update(
			{
				...schoolData,
			},
			{
				where: {
					id,
				},
			}
		);

		return updatedSchool;
	}
}
