import { permissions } from './permissions.js';

function getGuestDefaultUser() {
	return {
		role: 'user',
	};
}

function authRole(req, res, next) {
	/* 
    req.passport.session: { user: 'asdadggadagw436qq'} albo undefined
    req.user: {
        _id: asdadasd,
        password: 'sofvlfsdknhf;lqk34lk125',
        email: 'ola@example.com,
        role: 'user',
        created: '',
    }
*/
	console.log('authRole() - middlewere');
	const resource = req.route.path; // /dashboard
	const method = req.method.toLowerCase(); // get, post, etc
	console.log('resource:', resource, 'method:', method);

	if (!req.user) {
		// jeśli nie  jest zalogowany to passport nie wstawid danych usera i nie ma role, tworzymy quest
		req.user = getGuestDefaultUser();
		// return res.redirect('/?msg=forbidden-access)
	}

	console.log('req.user', req.user);

	if (permissions.isResourceAllowedForUser(req.user.role, resource, method)) {
		// ma dostęp
		return next();
	} else {
		// nie ma dostępu
		res.status(401);
		return res.send('Access forbidden');
	}
}

export { authRole };
