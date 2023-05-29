/* 
    1. Napisz schemat opisujący fundację z wolontariuszami. Fundacja ma następujące pola:
       - name - String z walidacją gdzie w nazwie musi pojawić się słowo "Foundation"
       - address to obiekt z właściwościami street, city i country. miasto ma walidacje sprawdzającą
         czy jest jednym z kilku zapisanych w tablicy, użyj includes() na tablicy.
       - created - data dodania rekordu, domyślnie aktualny czas
       - volunteers - to tablica obiektów wolontariuszy. Każdy z obiektów posiada pola name,
                      surname, created oraz email (walidacja wymaga posiadania przez łańcuch @),
                      facebook (validacja wymaga aby adres zaczynał się z https://www.facebook.com)
       Pamiętaj aby do każdego pola dodać dokładny opis wymaganegu typu, czy jest required itd,
       do walidowanych pól dodaj również message mówiący jakie dane sa wymagane dla pola
    2. Napisz funkcję genRandVolunteer() która zwróci losowego wolontariusza jako obiekt
    3. Stwórz nową fundację o nazwie np: "Dev Foundation", podaj dowolny adres, a w tablicy zapisz
       minimum trzech wolontariuszy wykorzystując funkcję genRandVolunteer()
    4. Dokonaj validacji danych z użyciem validateSync(), pokaż zwrócone błędy dla nazwy fundacji
    5. Zrób walidację z wykorzystaniem metody validate() na instancji fundacji i pokaż ewentualne
       błędy w konsoli
    6. Skasuj wszystkie fundacje z bazy, zapisz utworzoną fundację do mongodb, w zwróconym
       rekordzie zmień miasto i zapisz ponownie rekord wykorzystując save()
*/
import mongoose from 'mongoose';
const url = 'mongodb://127.0.0.1:27017/trainingdb';
mongoose.connect(url);

const cities = ['Warszawa', 'Szczecin', 'Kraków'];

const foundationSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: {
		type: String,
		required: true,
		trim: true,
		minLength: 3,
		maxLength: 32,
		validate: {
			validator: function (text) {
				return text.toLowerCase().indexOf('foundation') >= 0;
			},
			message: "Name must have word 'Foundation'",
		},
	},
	address: {
		street: {
			type: String,
			required: true,
			trim: true,
			minLength: 1,
			maxLength: 32,
		},
		city: {
			type: String,
			required: true,
			trim: true,
			minLength: 1,
			maxLength: 32,
			validate: {
				validator: function (text) {
					return cities.includes(text);
				},
				message: 'City must be one of the cities in array: ' + cities.join(','),
			},
		},
		country: {
			type: String,
			required: true,
			trim: true,
			minLength: 1,
			maxLength: 32,
		},
	},
	created: {
		type: Date,
		default: Date.now,
	},
	volunteers: [
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
			email: {
				type: String,
				required: true,
				trim: true,
				minLength: 1,
				maxLength: 128,
				validate: {
					validator: function (text) {
						return text.includes('@');
					},
					message: 'Email must have @ sign',
				},
			},
			facebook: {
				type: String,
				required: false,
				trim: true,
				minLength: 1,
				maxLength: 256,
				validate: {
					validator: function (text) {
						return text.startsWith('https://www.facebook.com');
					},
					message: 'Facebook url must start with: https://www.facebook.com',
				},
			},
			created: {
				type: Date,
				default: Date.now,
			},
		},
	],
});

const Foundation = mongoose.model('Foundation', foundationSchema);

function getRandElFromArr(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function genRandVolunteer() {
	const namesArr = ['Ania', 'Kasia', 'Ola', 'Zuza'];
	const surnameArr = ['Kowalska', 'Adamska', 'Barska'];
	const name = getRandElFromArr(namesArr);
	const surname = getRandElFromArr(surnameArr);
	const userAddr = name.toLowerCase() + '.' + surname.toLowerCase();

	return {
		name: name,
		surname: surname,
		email: userAddr + '@gmail.com',
		facebook: 'https://www.facebook.com/' + userAddr,
	};
}

const foundation1 = new Foundation({
	_id: new mongoose.Types.ObjectId(),
	name: 'Dev Foundation',
	address: {
		street: 'Wilcza 7',
		city: 'Warszawa',
		country: 'Polska',
	},
	volunteers: [genRandVolunteer(), genRandVolunteer(), genRandVolunteer()],
});

const validationsErrors = foundation1.validateSync();
console.log(validationsErrors);

if (validationsErrors && validationsErrors.errors['name']) {
	console.log('name error msg:', validationsErrors.errors['name'].message);
	console.log('name error path:', validationsErrors.errors['name'].path);
	console.log('name error value:', validationsErrors.errors['name'].value);
}

if (validationsErrors) {
	if (validationsErrors.name === 'ValidationError') {
		const field = Object.keys(validationsErrors.errors)[0];
		console.log('ValidationError:', validationsErrors.errors[field].message);
	}
}

try {
	foundation1.validate();

	await Foundation.deleteMany({});

	const foundationDb = await foundation1.save();
	foundationDb.address.city = 'Szczecin';
	await foundationDb.save();

	console.log('Data saved');
} catch (err) {
	console.log(err);
} finally {
	await mongoose.disconnect();
}
