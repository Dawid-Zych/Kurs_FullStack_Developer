import mongoose from 'mongoose';

const url = 'mongodb://127.0.0.1:27017/mongoosetest';
mongoose.connect(url);

const carSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	brand: {
		type: String,
		required: true,
		trim: true,
		minLength: 1,
		maxLength: 24,
	},
	name: {
		type: String,
		required: true,
		trim: true,
		minLength: 1,
		maxLength: 24,
	},
	color: {
		type: String,
		required: false,
		enum: ['red', 'black', 'white', 'orange', 'yellow', 'blue', 'green'],
	},
	topSpeed: {
		type: Number,
		required: false,
		validate: {
			validator: function (v) {
				return v > 0;
			},
			message: 'TopSpeed must be higher than 0',
		},
	},
	created: {
		type: Date,
		default: Date.now,
	},
});

const Car = mongoose.model('Car', carSchema);

const car1 = new Car({
	_id: new mongoose.Types.ObjectId(),
	brand: 'Ford',
	name: 'Mustang',
	color: 'red',
	topSpeed: 220,
});

const car2 = new Car({
	_id: new mongoose.Types.ObjectId(),
	brand: 'Ford',
	name: 'T',
	color: 'black',
	topSpeed: 70,
});

const car3 = new Car({
	_id: new mongoose.Types.ObjectId(),
	brand: 'Dodge',
	name: 'Viper',
	color: 'blue',
	topSpeed: 290,
});

const car4 = new Car({
	_id: new mongoose.Types.ObjectId(),
	brand: 'Dodge',
	name: 'Charger',
	color: 'yellow',
	topSpeed: 315,
});

try {
	await Car.deleteOne({ brand: 'Ford' }); // kasowanie jednego rekordu
	await Car.deleteMany({}); // kasowanie wielu elementów, kasujemy wszystkie elementy

	const car1Db = await car1.save();

	const carArr = [car2, car3, car4];
	await Car.insertMany(carArr);

	const carById = await Car.findById(car1Db._id);
	console.log('Car by id from db: ', carById._id);

	const carByBrand = await Car.findOne({ brand: 'Dodge', name: 'Viper' });
	console.log('Car by brand from db: ', carByBrand);

	carByBrand.color = 'red';
	carByBrand.save(); //aktualizacja na red w bazie danych
	console.log(carByBrand);

	// aktualizacja przez findOneAndUpdate
	const update = { topSpeed: 300 };

	// new true zwraca zaktualizowany dokument z bazy, tak zwróciłoby przed zaaktualizowaniem
	const viperDoc = await Car.findOneAndUpdate({ name: 'Viper' }, update, { new: true });
	console.log(viperDoc.topSpeed);

	const chargerById = await Car.findOne({ name: 'Charger' });
	console.log('Charger by id:', chargerById._id);

	Car.findByIdAndDelete(chargerById._id); // kasujemy element po ID
} catch (err) {
	console.log('Error:', err.message);
} finally {
	await mongoose.disconnect();
}
