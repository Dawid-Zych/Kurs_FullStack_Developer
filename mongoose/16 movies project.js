import mongoose from 'mongoose';
const url = 'mongodb://127.0.0.1:27017/movie';

mongoose.connect(url);
console.log('polączono z mongodb');

const movieSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	title: {
		type: String,
		required: true,
		trim: true,
		minLength: 1,
		maxLength: 128,
	},
	premiere: {
		type: Date,
		default: Date.now,
	},
	director: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Person',
	},
	writers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Person',
		},
	],
	actors: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Person',
		},
	],
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Review',
		},
	],
	created: {
		type: Date,
		default: Date.now,
	},
});

const Movie = mongoose.model('Movie', movieSchema);

const personSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: {
		type: String,
		required: true,
		trim: true,
		minLength: 1,
		maxLength: 20,
	},
	surrname: {
		type: String,
		required: true,
		trim: true,
		minLength: 1,
		maxLength: 32,
	},
	movieActor: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Movie',
		},
	],
	movieDirector: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Movie',
		},
	],
	movieWriter: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Movie',
		},
	],
	created: {
		type: Date,
		default: Date.now,
	},
});

const Person = mongoose.model('Person', personSchema);

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		minLength: 1,
		maxLength: 16,
	},
	surrname: {
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
		maxLength: 132,
		unique: true,
		match: /.+\@.+\..+/,
	},
	review: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Review',
		},
	],
	created: {
		type: Date,
		default: Date.now,
	},
});

const User = mongoose.model('User', userSchema);

const reviewSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	movie: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Movie',
	},
	body: {
		type: String,
		required: false,
		trim: true,
		minLength: 1,
		maxLength: 2048,
	},
	score: {
		type: Number,
		required: true,
		validate: {
			validator: function (v) {
				return v >= 1 && v <= 5;
			},
			message: 'Score must be between 1 and 5 stars',
		},
	},
});

await Person.deleteMany();
await Movie.deleteMany();
await Review.deleteMany();
await User.deleteMany();

const Review = mongoose.model('Review', reviewSchema);

await mongoose.disconnect();
