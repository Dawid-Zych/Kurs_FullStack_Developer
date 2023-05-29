/*  crud_challenge.js
    07.1 Mongoose - operacje CRUD - zadanie     c30ch28m07.1 
    Zadanie z CRUD w Mongoose
    1. Zrób schemat opisujący budynek z nastepującymi polami: obiekt address (z street, city, 
       postalCode z validacją z obowiązkowym znakiem '-', country), kolor budynku jako enum z tablicy
       kolorów, floorsNum - liczbowa ilość pięter z validacją z zakresu od 0 do max 50, created,
       residents - tablica mieszkańców z polami: name, surname i floorNum (validacja >= 0 i < 50)
    2. Stwórz kilka budynków z kilkoma mieszkańcami
    3. Skasuj jeden rekord z floorsNum o wartości 3. Skasuj wszystkie inne rekordy
    4. Zapisz pierwszy budynek z metodą save() przypisując zwracany obiekt z bazy do building1Db. 
       Zapisz tablicę 2 budynków z metodą insertMany(). Wyszukaj w bazie budynek po building1Db._id
       Wyszukaj jeden budynek z 3-ma piętrami używając findOne(), zmień kolor na "white" i zapisz.
       Zaktualizuj kolor budynku na "black" ze względu z building1Db._id z findOneAndUpdate()
       Skasuj budynek z findByIdAndDelete() używając building1Db._id
*/

import mongoose from 'mongoose';
const url = 'mongodb://127.0.0.1:27017/trainingdb';
mongoose.connect(url);

const builingColors = ['grey', 'silver', 'brown', 'white', 'black'];

const buildingSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	address: {
		street: {
			type: String,
			required: true,
			trim: true,
			minLength: 1,
			maxLength: 24,
		},
		city: {
			type: String,
			required: true,
			trim: true,
			minLength: 1,
			maxLength: 32,
		},
		postalCode: {
			// 00-000
			type: String,
			required: true,
			trim: true,
			minLength: 1,
			maxLength: 6,
			validate: {
				validator: function (text) {
					return text.indexOf('-') > 0;
				},
				message: "Postal code must have '-' sign",
			},
		},
		country: {
			type: String,
			required: true,
			trim: true,
			minLength: 1,
			maxLength: 24,
		},
	},
	color: {
		type: String,
		required: true,
		enum: builingColors,
	},
	floorsNum: {
		type: Number,
		required: true,
		validate: {
			validator: function (v) {
				return v >= 0 && v < 50;
			},
			message: 'floorsNum must be between 0 and 50',
		},
	},
	created: {
		type: Date,
		default: Date.now,
	},
	residents: [
		{
			name: {
				type: String,
				required: true,
				trim: true,
				minLength: 1,
				maxLength: 16,
			},
			surname: {
				type: String,
				required: true,
				trim: true,
				minLength: 1,
				maxLength: 32,
			},
			floorNum: {
				type: Number,
				required: true,
				trim: true,
				validate: {
					validator: function (v) {
						return v >= 0 && v < 50;
					},
					message: 'floorsNum must be between 0 and 50',
				},
			},
		},
	],
});

const Building = mongoose.model('Building', buildingSchema);

const building1 = new Building({
	_id: new mongoose.Types.ObjectId(),
	address: {
		street: 'Wilcza 7',
		city: 'Warszawa',
		postalCode: '00-001',
		country: 'Polska',
	},
	color: 'grey',
	floorsNum: 3,
	residents: [
		{ name: 'Ola', surname: 'Kowalska', floorNum: 0 },
		{ name: 'Adam', surname: 'Adamski', floorNum: 1 },
		{ name: 'Kasia', surname: 'Kowalska', floorNum: 2 },
	],
});

const building2 = new Building({
	_id: new mongoose.Types.ObjectId(),
	address: {
		street: 'Piękna 70',
		city: 'Kraków',
		postalCode: '00-111',
		country: 'Polska',
	},
	color: 'brown',
	floorsNum: 4,
	residents: [
		{ name: 'Zuza', surname: 'Kowalska', floorNum: 0 },
		{ name: 'Karol', surname: 'Adamski', floorNum: 1 },
		{ name: 'Asia', surname: 'Kowalska', floorNum: 2 },
		{ name: 'Zosia', surname: 'Kowalska', floorNum: 3 },
	],
});

const building3 = new Building({
	_id: new mongoose.Types.ObjectId(),
	address: {
		street: 'Piękna 20',
		city: 'Gdańsk',
		postalCode: '05-111',
		country: 'Polska',
	},
	color: 'black',
	floorsNum: 5,
	residents: [
		{ name: 'Zuza', surname: 'Kowalska', floorNum: 0 },
		{ name: 'Karol', surname: 'Adamski', floorNum: 1 },
		{ name: 'Asia', surname: 'Kowalska', floorNum: 2 },
		{ name: 'Zosia', surname: 'Kowalska', floorNum: 3 },
		{ name: 'Kasia', surname: 'Kowalska', floorNum: 4 },
	],
});

try {
	await Building.deleteOne({ floorNum: 3 });
	await Building.deleteMany({});

	const building1Db = await building1.save();
	console.log('building1Db._id: ', building1Db._id);

	const buildingArr = [building2, building3];
	await Building.insertMany(buildingArr);

	const buildingWith3Floors = await Building.findOne({ floorsNum: 3 });
	console.log('Building with 3 floors with _id:', buildingWith3Floors._id);
	buildingWith3Floors.color = 'white';
	buildingWith3Floors.save();

	const update = { color: 'black' };
	const recordDb = await Building.findOneAndUpdate({ _id: building1Db._id }, update, { new: true });
	console.log('recordDb.color:', recordDb.color);

	Building.findByIdAndDelete(building1Db._id);
} catch (err) {
	console.error(err);
} finally {
	await mongoose.disconnect();
}
