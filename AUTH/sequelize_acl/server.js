// npm init -y
// npm i express express-session ejs passport passport-local mongodb mongoose
// w package.json type jako module

import express from 'express';
import { passport } from './utility/auth.js';
import expressSession from 'express-session';
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { authRole } from './utility/aclauth.js';
import { usersController, subjectsController, schoolsController, gradesController } from './controllers/controllers.js';
import { rolesArr } from './models/user.model.js';
import { htmlHelper } from './helpers/htmlHelper.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.urlencoded({ extended: false })); // sparsuje dane przesłane z POST

// przypisujemy do locals dowolna zmienna
// bedzie dostepny w kazdym widoku
app.locals.htmlHelper = htmlHelper;

app.use(
	expressSession({
		secret: 'secret',
		resave: false,
		saveUninitialized: true,
	})
);

app.use(passport.initialize());
app.use(passport.session());

// sprawdza czy zalogowany user, wtedy pozwala odzwiedzić dany url
const checkAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		// czy zalogowany
		return next(); // jeśli tak to może zobaczyc adres np dashboard
	}
	res.redirect('/'); // nie zalogowany, nie może zobaczyć dashboard, wraca na stronę główną
};

// funkcja sprawdzająca czy zalogowany użytkownik, jeśli tak i chce
// wejść na login czy register to trafi do dashboard
const checkLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		//zwróci true jeśli zautoryzowany suer czyli dane w req.session.passport.user
		return res.redirect('/dashboard');
	}
	next();
};

const viewsPath = path.join(__dirname, 'views');
app.set('views', viewsPath);
app.set('view engine', 'ejs');
app.use(express.static('./public'));

// rejestracja usera, checkLoggedIn() sprawdza czy zalogowany to wtedy redirect na dashboard
app.get('/register', checkLoggedIn, async (req, res) => {
	console.log('/register');
	const schools = await schoolsController.getAll();
	res.render('pages/register.ejs', {
		user: req.user,
		schools: schools,
	});
});

app.post(
	'/register',
	passport.authenticate('local-signup', {
		successRedirect: '/login?reg=success',
		failureRedirect: '/register?reg=failure',
	})
);

// logowanie usera
app.get('/login', checkLoggedIn, (req, res) => {
	console.log('/login');
	res.render('pages/login.ejs', {
		user: req.user,
	});
});

app.post(
	'/login',
	passport.authenticate('local-login', {
		successRedirect: '/dashboard',
		failureRedirect: '/login?log=failure',
	})
);

//wylogowanie
app.get('/logout', (req, res, next) => {
	req.logout(function (err) {
		console.log('User logged out!');
		if (err) return next(err);
		res.redirect('/');
	});
});

app.post('/logout', (req, res, next) => {
	req.logout(function (err) {
		console.log('User logged out!');
		if (err) return next(err);
		res.redirect('/');
	});
});

app.get('/dashboard', checkAuthenticated, (req, res) => {
	console.log('/dashboard');
	res.render('pages/dashboard.ejs', {
		user: req.user,
	});
});

/* Połączenia z naszymi rolami */

app.get('/admin/users', authRole, async (req, res) => {
	console.log('/admin/users');

	const users = await usersController.getAll();
	const schools = await schoolsController.getAll();

	res.render('pages/admin/users.ejs', {
		user: req.user,
		users: users,
		schools: schools,
	});
});

app.get('/admin/users/add', authRole, async (req, res) => {
	console.log('/admin/users/add');
	const schools = await schoolsController.getAll();

	res.render('pages/admin/user_add.ejs', {
		user: req.user,
		schools: schools,
		rolesArr: rolesArr,
	});
});

app.post('/admin/users/add', authRole, async (req, res) => {
	console.log('POST   /admin/users/add');
	console.log('req.body:', req.body);

	const userDb = await usersController.createUser(req.body);
	res.redirect('/admin/users');
});

app.get('/admin/users/edit/:id', authRole, async (req, res) => {
	console.log('GET /admin/users/edit/:id');
	const { id } = req.params;
	if (!id) return res.redirect('/admin/users');

	const schools = await schoolsController.getAll();

	const userToEdit = await usersController.getById(id);
	res.render('pages/admin/user_edit.ejs', {
		user: req.user, // admin
		userToEdit: userToEdit,
		schools: schools,
		rolesArr: rolesArr,
	});
});

app.post('/admin/users/edit/:id', authRole, async (req, res) => {
	console.log('POST /admin/users/edit/:id');
	const { id } = req.params;
	if (!id) return res.redirect('/admin/users');

	const updatedUser = await usersController.updateById(id, req.body);
	res.redirect('/admin/users');
});

//schools
app.get('/admin/schools', authRole, async (req, res) => {
	console.log('/admin/schools');
	const schools = await schoolsController.getAll();
	const directors = await usersController.getAllUsersByRole('director');

	res.render('pages/admin/schools/index.ejs', {
		user: req.user,
		schools: schools,
		directors: directors,
	});
});

app.get('/admin/schools/add', authRole, async (req, res) => {
	console.log('/admin/schools/add');
	const schools = await schoolsController.getAll();
	const directors = await usersController.getAllUsersByRole('director');

	res.render('pages/admin/schools/school_add.ejs', {
		user: req.user,
		schools: schools,
		directors: directors,
	});
});

app.post('/admin/schools/add', authRole, async (req, res) => {
	console.log('POST /admin/schools/add');
	const { id } = req.params;
	const schoolDb = await schoolsController.createSchool(req.body);
	res.redirect('/admin/schools');
});

// EDIT
app.get('/admin/schools/edit/:id', authRole, async (req, res) => {
	console.log('/admin/schools/edit/:id');

	const { id } = req.params;
	if (!id) return res.redirect('/admin/schools');

	const directors = await usersController.getAllUsersByRole('director');
	const schoolToEdit = await schoolsController.getByID(id);
	res.render('pages/admin/schools/school_edit.ejs', {
		user: req.user,
		directors: directors,
		schoolToEdit: schoolToEdit,
	});
});

app.post('/admin/schools/edit/:id', authRole, async (req, res) => {
	console.log('POST /admin/schools/edit/:id');
	const { id } = req.params;

	if (!id) return res.redirect('/admin/schools');

	const updatedSchool = await schoolsController.updateById(id, req.body);

	res.redirect('/admin/schools');
});

// VIEW

app.get('/admin/schools/view/:id', authRole, async (req, res) => {
	console.log('/admin/schools/view/:id');

	const { id } = req.params;
	if (!id) return res.redirect('/admin/schools');

	const directors = await usersController.getAllUsersByRole('director');
	const schoolToView = await schoolsController.getByID(id);

	res.render('pages/admin/schools/school_view.ejs', {
		user: req.user,
		directors: directors,
		schoolToView: schoolToView,
	});
});

// SUBJECTS
app.get('/subjects', authRole, async (req, res) => {
	console.log('/subjects');
	const schools = await schoolsController.getAll();
	const subjects = await subjectsController.getAll();
	const teachers = await usersController.getAllUsersByRole('teacher');

	res.render('pages/subjects/index.ejs', {
		user: req.user,
		subjects: subjects,
		schools: schools,
		teachers: teachers,
	});
});

app.get('/subjects/add', authRole, async (req, res) => {
	console.log('/subjects/add');
	const schools = await schoolsController.getAll();
	const teachers = await usersController.getAllUsersByRole('teacher');

	res.render('pages/subjects/subject_add.ejs', {
		user: req.user,
		schools: schools,
		teachers: teachers,
	});
});

app.post('/subjects/add', authRole, async (req, res) => {
	console.log('POST /subjects/add');

	const subjectDB = await subjectsController.createSubject(req.body);
	res.redirect('/subjects');
});

app.get('/subjects/edit/:id', authRole, async (req, res) => {
	console.log('/subjects/edit/:id');

	const { id } = req.params;
	if (!id) return res.redirect('/subjects');

	const subjectToEdit = await subjectsController.getById(id);
	const schools = await schoolsController.getAll();
	const teachers = await usersController.getAllUsersByRole('teacher');

	res.render('pages/subjects/subject_edit.ejs', {
		user: req.user,
		subjectToEdit: subjectToEdit,
		schools: schools,
		teachers: teachers,
	});
});

app.post('/subjects/edit/:id', authRole, async (req, res) => {
	console.log('POST /subjects/edit/:id');
	const { id } = req.params;

	if (!id) return res.redirect('/subjects');

	const updatedSubject = await subjectsController.updateById(id, req.body);

	res.redirect('/subjects');
});

// VIEW

app.get('/subjects/view/:id', authRole, async (req, res) => {
	console.log('subjects/view/:id');

	const { id } = req.params;
	if (!id) return res.redirect('/subjects');

	const subjectToView = await subjectsController.getById(id);
	const schools = await schoolsController.getAll();
	const teachers = await usersController.getAllUsersByRole('teacher');

	res.render('pages/subjects/subject_view.ejs', {
		user: req.user,
		subjectToView: subjectToView,
		schools: schools,
		teachers: teachers,
	});
});

app.get('/', (req, res) => {
	res.render('pages/index.ejs', {
		user: req.user,
	});
});
app.listen(3010, () => {
	console.log('Server started at port 3010');
});
