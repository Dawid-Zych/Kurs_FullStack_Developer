import mongoose from 'mongoose';

const url = 'mongodb://127.0.0.1:27017/mongoosetest';
mongoose.connect(url, function (err) {
	if (err) throw err;
	console.log('Connected to db');
});

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
		city: '',
	},
	linkedin: 'https://www.linkedin.com/user/ola.kowalska',
});

try {
	await Student.deleteMany({ email: 'ola.kowalska@gmail.com' });

	let studentFromDb = await student1.save();
	//studentFromDb.address.city = "Olsztyn";
	//studentFromDb.save();
} catch (err) {
	console.log('Save try catch error:', err.message);
}
