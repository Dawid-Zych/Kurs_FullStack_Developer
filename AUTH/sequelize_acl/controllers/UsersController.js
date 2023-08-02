import brcrypt from 'bcryptjs';
import { User, School, Subject, Grade } from '../models/relationsSchema.js';

export class UsersController {
	async getAll() {
		return await User.findAll({});
	}

	async getAllUsersByRole(role) {
		return await User.findAll({ where: { role } });
	}

	async createUser(userData, schoolDb) {
		const salt = await brcrypt.genSalt(10);
		userData.password = await brcrypt.hash(userData.password, salt);

		const userDb = await User.create(userData);

		if (schoolDb) {
			await userDb.setSchool(schoolDb);
		}

		return userDb;
	}

	async validPassword(password, userDb) {
		try {
			return await brcrypt.compare(password.userDb.password);
		} catch (error) {
			throw new Error(error);
		}
	}

	async setSchool(userDb, schoolDb) {
		if (userDb && schoolDb) {
			await userDb.setSchool(schoolDb);
			return true;
		}
		return false;
	}

	async getById(id) {
		return await User.findByPk(id);
	}

	async updateById(id, userData) {
		const updatedUser = await User.update({ ...userData }, { where: { id } });

		return updatedUser;
	}

	async getUserByEmail(email) {
		return await User.findOne({ where: { email } });
	}
}
