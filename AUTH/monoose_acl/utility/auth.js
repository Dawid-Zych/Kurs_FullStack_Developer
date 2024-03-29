import passport from 'passport';
import LocalStrategy from 'passport-local';
import { User, makeUser } from '../models/user.model.js';

passport.serializeUser((user, done) => {
	// funkcja otrzymuje zautoryzowanego usera z authUser()
	// wywołujemy done i passport zapisze id usera do req.session.passport.user
	// w ten sposób dane użytkownika zapisane są w sesji czyli np
	// { id: 5, name: 'user#001',surname: 'Kowalski'}
	// To id będzie użyte przez deserializeUser() do pobrania pełnych danych użytkownika
	console.log('serializeUser(),user.id: ', user.id);
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	// funkcja na podstawie przekazanego id pobiera pełne dane
	// użytkownika z bazy i zwraca je do done(), dzięki temu
	// trafia on do req.user i może być użyty gdziekolwiek w apce

	try {
		const userDb = await User.findById(id);
		console.log('deserializeUser(), userDb:', userDb);

		done(null, userDb);
	} catch (error) {
		done(error);
	}
});

// 2 strategie 1 dla logowania, druga dla rejestracji

/*     REJESTRACJA UŻYTKOWNIKA     */
passport.use(
	'local-signup',
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
		},
		async (email, password, done) => {
			try {
				const userExists = await User.findOne({ email });
				if (userExists) {
					// jest już w bazie
					return done(null, false); // kończymy bo user o tym email istnieje w bazie
				}

				const user = makeUser(email, password);

				const userDb = await user.save();

				return done(null, userDb); // user jest zarejestrowany i przekazany dalej do passport js
			} catch (error) {
				return done(error);
			}
		}
	)
);

const authUser = async (req, email, password, done) => {
	// authUser to funkcja pozwalająca na autoryzację użytkownika, zwraca zautoryzowanego
	// użytkownika np z bazy, authUser używana jest przez strategię do autoryzacji usera
	try {
		const authenticatedUser = await User.findOne({ email });
		if (!authenticatedUser) {
			// nie ma usera w bazie
			return done(null, false);
		}

		if (!authenticatedUser.validPassword(password)) {
			return done(null, false);
		}

		return done(null, authenticatedUser); // zwracamy zalogowanego usera, prawidłowy email i hasło
	} catch (error) {
		return done(error);
	}
};

passport.use(
	'local-login',
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true,
		},
		authUser
	)
);

export { passport };
