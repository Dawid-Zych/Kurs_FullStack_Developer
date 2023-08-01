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
import { dir } from 'console';

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
        username: "user#001",
        surname: "Kowalski"
    };

    // na potrzeby przykładu zawsze zwracamy zautoryzowanego usera, że udało się 
    // go znaleźć w bazie
    return done(null, authenticatedUser);
}
