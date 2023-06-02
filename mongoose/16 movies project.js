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

const Review = mongoose.model('Review', reviewSchema);

await Person.deleteMany();
await Movie.deleteMany();
await Review.deleteMany();
await User.deleteMany();

const scorsese = await Person.create({
	_id: new mongoose.Types.ObjectId(),
	name: 'Martin',
	surrname: 'Scorsese',
});

const stone = await Person.create({
	_id: new mongoose.Types.ObjectId(),
	name: 'Sharon',
	surrname: 'Stone',
});

const deNiro = await Person.create({
	_id: new mongoose.Types.ObjectId(),
	name: 'Robert',
	surrname: 'De Niro',
});

const pesci = await Person.create({
	_id: new mongoose.Types.ObjectId(),
	name: 'Joe',
	surrname: 'Pesci',
});

const pileggi = await Person.create({
	_id: new mongoose.Types.ObjectId(),
	name: 'Nicholas',
	surrname: 'Pileggi',
});

const casino = await Movie.create({
	_id: new mongoose.Types.ObjectId(),
	title: 'Casino',
	premiere: new Date(1955, 11, 3),
	director: scorsese,
	// actors: [stone, deNiro, pesci],
});

async function connectMovieToActor(movie, person) {
	await Movie.findByIdAndUpdate(movie._id, { $addToSet: { actors: person._id } });
	await Person.findByIdAndUpdate(person._id, { $addToSet: { movieActor: movie._id } });
}

async function connectMovieToWriter(movie, person) {
	await Movie.findByIdAndUpdate(movie._id, { $addToSet: { writers: person._id } });
	await Person.findByIdAndUpdate(person._id, { $addToSet: { movieWriter: movie._id } });
}

async function connectMovieToDirector(movie, person) {
	await Movie.findByIdAndUpdate(movie._id, { $addToSet: { director: person._id } });
	await Person.findByIdAndUpdate(person._id, { $addToSet: { movieDirector: movie._id } });
}

await connectMovieToActor(casino, stone);
await connectMovieToActor(casino, deNiro);
await connectMovieToActor(casino, pesci);
await connectMovieToWriter(casino, pileggi);
await connectMovieToWriter(casino, scorsese);

const user1 = await User.create({
	name: 'Ola',
	surrname: 'Kowalska',
	email: 'ola.kowalska@gmail.com',
});
const user2 = await User.create({
	name: 'Adam',
	surrname: 'Adamski',
	email: 'adam.adamski@gmail.com',
});

const review1 = await Review.create({
	user: user1,
	movie: casino,
	body: 'ujdzie w tłumie',
	score: 5,
});

const review2 = await Review.create({
	user: user2,
	movie: casino,
	body: 'Great movie',
	score: 3.5,
});

async function connectMovieToReview(movie, review) {
	await Movie.findByIdAndUpdate(movie._id, {
		$addToSet: { reviews: review._id },
	});
	await Review.findOneAndUpdate(
		{
			_id: review._id,
		},
		{ movie: movie._id }
	);
}
await connectMovieToReview(casino, review1);
await connectMovieToReview(casino, review2);

const movieDb = await Movie.find().populate([
	{ path: 'director' },
	{ path: 'actors' },
	{ path: 'writers' },
	{
		path: 'reviews',
		populate: {
			path: 'user',
		},
	},
]);

console.log(JSON.stringify(movieDb, null, 4));
await mongoose.disconnect();
