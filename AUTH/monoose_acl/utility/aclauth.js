import { permissions } from './permissions.js';

function authRole(req, res, next) {
	return next();
}

export { authRole };
