// loogwanie z passport.js
// npm init -y
// nmp i express passport express-session passport-local ejs
// oprócz passport-local możemy jeszcze zastosować passport-google-oauth passport-facebook

import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import expressSession from 'express-session';
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url)); // ścieżka naszego projektu

const app = express();

// użyjemy middleware który automatycznie nam
//parsuje dane przesłane poprzez post do naszej aplikacji
//dostępne będa w req.body

app.use(express.urlencoded({ extended: false }));

//Middleware
// sesje polegają na zapisaniu informacji na temat użytkownika na serwerze w bazie danych albo w session-store
// dodatkowo sesja ma unikalny swój identyfikator któr przesyłany jest w ciasteczku do użytkownika
// więc następnym razem przeglądarka przy kolejnych odwiedzinach nam go zwróci i wiemy że to ta sama osoba
app.use(
	expressSession({
		secret: 'secret', // losowy długi string potrzebny do potwierdzenia prawdziwości sesji, przechowywany
		//  w aplikacji nie może być udostepniany na zewnątrz
		resave: false, // czy sesje mają być zapisywane w session-store, zwykle daje się false ponieważ może to
		// powodować problemy jak równocześnie request robi dwukrotnie ta sama osoba
		saveUninitialized: true, // wrzuca nie zainicjowaną sesje do sessions store, jeżeli sesja została
		// utworzona ale nie zmodyfikowana nazywana jest niezainicjalinowaną
	})
);

app.use(passport.initialize()); // passport będzie działał na każdym requeście
app.use(passport.session()); // umożliwia passportowi używanie mechanizmu sesji

// authuser to funkcja pozwalająca na autoryzację użytkownika, zwraca zautoryzowanego
// użytkownika np z bazy, authUser używana jest przez strategię do autoryzacji usera
const authUser = (user, password, done) => {
	//passport dodane do user dane z req.body.username i req.body.password
	console.log(` - authUser() username: ${user}, password: ${password} `);

	// user oraz password muszą być użyte do odnalezienia użytkownika w bazie danych
	// 1. Jeżeli użytkownik nie jest znaleziony lub jest złe hasło zwracamy  done(null, false)
	// 2. Gdy użytkownik i hasło się zgadzają z rekordem w bazie zwracamy  done(null, user)

	let authenticatedUser = {
		id: 5,
		username: 'user#001',
		surname: 'Kowalski',
	};

	// na potrzeby przykładu zawsze zwracamy zautoryzowanego usera, że udało się
	// go znaleźć w bazie
	return done(null, authenticatedUser);
};

// przekazujemy funkcję autoryzującą do lokalnej strategii
passport.use(
	new LocalStrategy(
		{
			usernameField: 'username',
			passwordField: 'password',
		},
		authUser
	)
);

passport.serializeUser((user, done) => {
	// funkcja otrzymuje zautoryzowanego usera z authUser()
	console.log(' - serializeUser(), user:', user);

	// wywołujemy done i passport zapisze id usera do
	// req.session.passport.user
	// w ten sposób dane użytkownika zapisane są w sesji czyli np
	// {id: 5, name: 'user#001', surname: 'Kowalski'}
	// To id będzie użyte przez deserializeUser() do pobrania pełnych danych użytkownika

	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	// funkcja na podstawie przekazanego id pobiera pełne dane
	// użytkownik np z bazy i zwraca je do done(), dzięki temu
	// trafia on do req.user i może być użyty gdziekolwiek w apce
	console.log(' - deserializeUser with id:', id);

	const userDB = {
		id: 5,
		username: 'user#001',
		surname: 'Kowalski',
	};

	done(null, userDB);
});

// sprawdza czy zalogowany user, wtedy pozwala odwiedzić dany url
// jeśli nie zalogowany to redirect na stronę główną
// używana funkcja np do obsługi adresu /dashboard który jest tylko dla zalogowanych
const checkAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		// zwróci true jeśli zautoryzowany user czyli dane w req.session.passport.user
		return next(); // jeśli zautoryzowany i może odwiedzić url
	}

	res.redirect('/'); // nie zautoryzowany user więc redirect na stronę główną
};

// funkcja sprawdzająca czy zalogowany użytkownik, jeśli tak i chce
// wejść na login czy register to trafi na dashboard
const checkLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		//zwróci true jeśli zautoryzowany user czyli dane w req.session.passport.user
		return res.redirect('/dashboard');
	}

	next();
};

let count = 0;
const printRequestData = (req, res, next) => {
	console.log('\nREQUEST num:', +count++ + ' date:' + new Date());
	console.log('req.body.username:', req.body.username);
	console.log('req.body.password:', req.body.password);
	console.log('req.session.passport:', req.session.passport);
	console.log('req.user:', req.user);
	console.log('req.session.id:', req.session.id);
	console.log('req.session.cookie:', req.session.cookie);
	next();
};

app.use(printRequestData);

// routing i połączenie z passportem

const viewsPath = path.join(__dirname, 'views');
console.log('viewsPath', viewsPath);

app.set('views', viewsPath);
app.set('view engine', 'ejs');
app.use(express.static('./public'));

app.get('/login', checkLoggedIn, (req, res) => {
	console.log('get /login');
	res.render('pages/login.ejs');
});

app.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/login',
	})
);

app.get('/dashboard', checkAuthenticated, (req, res) => {
	console.log(' get /dashboard');
	res.render('pages/dashboard.ejs', {
		name: req.user.username,
	});
});

app.get('/logout', (req, res, next) => {
	req.logout(function (err) {
		console.log(' User logged out!');

		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
});

app.post('/logout', (req, res, next) => {
	req.logout(function (err) {
		console.log(' User logged out!');

		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
});

app.get('/', (req, res) => {
	res.render('pages/index.ejs', {
		name: 'unknown',
	});
});

app.listen(3010, () => {
	console.log('Server started at port 3010');
});
