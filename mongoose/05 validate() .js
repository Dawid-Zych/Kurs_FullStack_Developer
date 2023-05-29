import mongoose from 'mongoose';

const url = 'mongodb://127.0.0.1:27017/mongoosetest';
mongoose.connect(url);

const studentSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	firstName: {
		type: String,
		required: true,
		trim: true,
		minLength: 1,
		maxLength: 32,
	},
	lastName: {
		type: String,
		required: false,
		trim: true,
		minLength: 1,
		maxLength: 32,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		minLength: 3,
		maxLength: 128,
		validate: {
			validator: function (text) {
				return text.indexOf('@') > 0;
			},
		},
	},
	address: {
		street: {
			type: String,
			required: false,
			trim: true,
			minLength: 1,
			maxLength: 32,
		},
		city: {
			type: String,
			required: false,
			trim: true,
			minLength: 1,
			maxLength: 32,
		},
	},
	linkedin: {
		type: String,
		required: false,
		validate: {
			validator: function (txt) {
				return txt.indexOf('https://www.linkedin.com') >= 0;
			},
			message: 'Student linkedin should start with https://www.linkedin.com',
		},
	},
	created: {
		type: Date,
		default: Date.now,
	},
});

const Student = mongoose.model('Student', studentSchema);

const student1 = new Student({
	_id: new mongoose.Types.ObjectId(),
	firstName: 'Ola',
	lastName: 'Kowalska',
	email: 'ola.kowalska@gmail.com',
	address: {
		street: 'Wilcza 7',
		city: 'WaWA',
	},
	linkedin: 'https://www.linkedin.com/user/ola.kowalska',
});

let validationErrors = student1.validateSync();
//console.log(validationErrors);

if (validationErrors && validationErrors.errors['address.city']) {
	console.log(validationErrors.errors['address.city'].message); // opis błędu
	console.log(validationErrors.errors['address.city'].path); // address.city
	console.log(validationErrors.errors['address.city'].value); // błędna wartość
}

if (validationErrors) {
	if (validationErrors.name == 'ValidationError') {
		const field = Object.keys(validationErrors.errors)[0]; // address.city
		console.log('VE:', validationErrors.errors[field].message);
	}
}

student1.validate();
try {
	await Student.deleteMany({ email: 'ola.kowalska@gmail.com' });

	let studentFromDb = await student1.save();
	console.log(studentFromDb);
	//studentFromDb.address.city = "Olsztyn";
	//studentFromDb.save();
} catch (err) {
	console.log('Save try catch error:', err.message);
} finally {
	await mongoose.disconnect();
}
