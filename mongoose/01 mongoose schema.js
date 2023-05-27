// Mongodb to baza danych dokumentów

// Mongoose to biblioteka do modelowania danych aplikacji
// czyli tzw. ODM - Object Data Modeling. Posiada
// wbudowaną walidację danych na bazie schematów, ma wiele
// gotowych rozwiązań, które ułatwiają pracę z mongodb

// w package.json dodatkowa właściwość type jako module dzięki
// czemu możemy używać es6 w nodejs czyli importów i exportów
// npm install mongodb
// npm install mongoose

import mongoose from 'mongoose';

// Z nazwą bazy, będzie automatycznie utworzona
const url = 'mongodb://127.0.0.1:27017/mongoosetest';
mongoose.connect(url);

// zaczynamy od schematu czyli opisania sztywnych
// wymagań dla danych jakie mają być zapisane w bazie
// określamy typy poszczególnych danych itd
const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	firstName: String,
	lastName: String,
	address: {
		street: String,
		city: {
			type: String,
		},
	},
	created: {
		type: Date,
		default: Date.now,
	},
});

// Mając schemat tworzymy na jego podstwie model,
// automatycznie zrobi to za nas mongoose.
// Pierwszy argument to pojedyńcza forma nazwy kolekcji
// Mongoose automatycznie zmieni ją na liczbę mnogą oraz
// na małe litery czyli z User będzie kolekcja users
const User = mongoose.model('User', userSchema);

// Tworzenie nowego obiektu na bazie modelu
const olekUser = new User({
	_id: new mongoose.Types.ObjectId(),
	firstName: 'Olek',
	lastName: 'Kowalski',
	address: {
		street: 'Wilcza 7',
		city: 'Wawa',
	},
});

// zapis obiektu do bazy danych
await olekUser.save();
// W compass powstanie element z __v to tzw versionKey
// czyli wersja dokumentu

// odczyt danych z bazy
const adamUser = await User.findOne({});
console.log(adamUser);
