/*  
    Zadanie:
    1. Napisz schemat reprezentujący pociąg z polami:
       - name - String z validacją wymagającą aby w nazwie było słowo "Train"
       - trip to obiekt z dwoma właściwościami from i to, oba to łańcuchy
         znaków, dodaj do obu enum wskazujący na tablicę z kilkoma polskimi
         miastami
       - passengers to tablica obiektów opisujących pasażerów z polami
         name i surname 
       - created - data dodania rekordu
    2. Stwórz jeden pociąg z kilkoma pasażerami, zvaliduj dane i pokaż
       ewentualne błędy w konsoli. Skasuj wszystkie pociągi w bazie,
       dodaj nowy rekord do bazy
*/

import mongoose from 'mongoose';

const url = 'mongodb://127.0.0.1:27017/trainingdb';
mongoose.connect(url);

const cities = ['Warszawa', 'Kraków', 'Gdańsk', 'Szczecin'];

const trainSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: {
		type: String,
		required: true,
		trim: true,
		minLength: 1,
		maxLength: 32,
		validate: {
			validator: function (text) {
				return text.indexOf('Train') >= 0;
			},
			message: "Name must have word 'Train'",
		},
	},
	trip: {
		from: {
			type: String,
			required: true,
			enum: cities,
		},
		to: {
			type: String,
			required: true,
			enum: cities,
		},
	},
	passengers: [
		{
			name: {
				type: String,
				trim: true,
				required: true,
				minLength: 1,
				maxLength: 32,
			},
			surname: {
				type: String,
				trim: true,
				required: true,
				minLength: 1,
				maxLength: 32,
			},
		},
	],
	created: {
		type: Date,
		default: Date.now,
	},
});

const Train = mongoose.model('Train', trainSchema);

const train1 = new Train({
	_id: new mongoose.Types.ObjectId(),
	name: 'Train #001',
	trip: {
		from: 'Warszawa',
		to: 'Kraków',
	},
	passengers: [
		{ name: 'Ola', surname: 'Kowalska' },
		{ name: 'Karol', surname: 'Adamski' },
		{ name: 'Kasia', surname: 'Kowalska' },
	],
});

const validationErrors = train1.validateSync();
console.log(validationErrors);

try {
	train1.validate();

	await Train.deleteMany({});

	const trainDb = await train1.save();

	console.log('Data saved to db');
} catch (err) {
	console.error(err);
} finally {
	await mongoose.disconnect();
}
