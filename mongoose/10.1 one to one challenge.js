/*  
    Zadanie z relacją one to one
    1. Stwórz schemat opisujący adres paczki z polami: name, surname, street, postalCode (validacja
       z sprawdzeniem czy jest znak '-'), city z enum tablicy miast, created będący datą. 
    2. Napisz drugi schemat opisujący paczkę z polami: payment jako Number z validacją wartości > 0,
       sender z type ObjectId z referencją do Address, recipient też z type ObjectId i ref: Address,
       parcelHistory jako tablicę obiektów opisujących historię przesyłki z polami: message i date.
       Schemat paczki kończy się polem created z domyślną aktualną datą rekordu.
    3. Skasuj wszystkie rekordy adresów i paczek w bazie
    4. Stwórz adres nadawcy i odbiorcy paczki, zapisz oba do bazy
    5. Stwórz paczkę i dodaj referencję do zapisanych w bazie adresów, zapisz paczkę w bazie
    6. Odczytaj paczkę z bazy, pamiętaj że w celu połaczenia danych z różnych kolekcji wywołaj
       populate i to dwa razy czyli .populate("sender").populate("recipient")
*/
import mongoose from 'mongoose';
const url = 'mongodb://127.0.0.1:27017/trainingdb';
mongoose.connect(url);

const citiesArr = ['Kraków', 'Warszawa', 'Poznań', 'Gdańsk'];

const Address = mongoose.model(
	'Address',
	new mongoose.Schema({
		name: {
			type: String,
			required: true,
			trim: true,
			minLength: 2,
			maxLength: 16,
		},
		surname: {
			type: String,
			required: true,
			trim: true,
			minLength: 2,
			maxLength: 32,
		},
		street: {
			type: String,
			required: true,
			trim: true,
			minLength: 2,
			maxLength: 24,
		},
		postalCode: {
			type: String,
			required: true,
			trim: true,
			minLength: 2,
			maxLength: 6,
			validate: {
				validator: function (text) {
					return text.indexOf('-') > 0;
				},
				message: "Postal code must have '-' sign",
			},
		},
		city: {
			type: String,
			required: true,
			trim: true,
			enum: citiesArr,
		},
		country: {
			type: String,
			required: true,
			trim: true,
			minLength: 2,
			maxLength: 16,
		},
		created: {
			type: Date,
			default: Date.now,
		},
	})
);

const Parcel = mongoose.model(
	'Parcel',
	new mongoose.Schema({
		payment: {
			type: Number,
			required: true,
			validate: {
				validator: function (v) {
					return v >= 0;
				},
				message: 'Price must be 0 or higher',
			},
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Address',
		},
		recipient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Address',
		},
		parcelHistory: [
			{
				message: {
					type: String,
					trim: true,
					required: false,
					minLength: 1,
					maxLength: 256,
				},
				date: {
					type: Date,
					default: Date.now,
				},
			},
		],
		created: {
			type: Date,
			default: Date.now,
		},
	})
);

await Address.deleteMany({});
await Parcel.deleteMany({});

const senderAdrress = new Address({
	name: 'Kasia',
	surname: 'Kowalska',
	street: 'Wilcza 10',
	postalCode: '01-567',
	city: 'Warszawa',
	country: 'Polska',
});
const senderAddressDb = await senderAdrress.save();

const recipientAdrress = new Address({
	name: 'Ola',
	surname: 'Adamska',
	street: 'Ujazdowskie 12',
	postalCode: '02-227',
	city: 'Warszawa',
	country: 'Polska',
});
const recipientAddressDb = await recipientAdrress.save();

const parcel = new Parcel({
	payment: 25.67,
	sender: senderAddressDb._id.toString(),
	recipient: recipientAddressDb._id.toString(),
	parcelHistory: [
		{ message: 'Paczka nadana', date: new Date(2023, 0, 8) },
		{ message: 'Paczka odebrana przez kuriera', date: new Date(2023, 0, 9) },
		{ message: 'Paczka w tranzycie', date: new Date(2023, 0, 10) },
		{ message: 'Paczka oczekuje na odbiór', date: new Date(2023, 0, 10) },
		{ message: 'Paczka odebrana', date: new Date(2023, 0, 11) },
	],
});

await parcel.save();

const parcelDb = await Parcel.find({}).populate('sender').populate('recipient');
console.log(parcelDb);
console.log(JSON.stringify(parcelDb, null, 4));

await mongoose.disconnect();
