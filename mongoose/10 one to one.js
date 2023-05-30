// Relacja one to one między rekordami w bazie danych np tv i pilot to powiązane urządzenia

import mongoose from 'mongoose';

const url = 'mongodb://127.0.0.1:27017/mongoosetest';
mongoose.connect(url);

const Tv = mongoose.model(
	'Tv',
	new mongoose.Schema({
		brand: String,
		model: String,
		size: Number,
	})
);

const Remote = mongoose.model(
	'Remote',
	new mongoose.Schema({
		brand: String,
		tv: {
			type: mongoose.Schema.Types.ObjectId, // pilot ma referencję do konkretnego tv po _id
			ref: 'Tv',
		},
	})
);

await Tv.deleteMany({});
await Remote.deleteMany({});

const svd = new Tv({
	brand: 'SVD',
	model: 'RLCD',
	size: 32,
});

const tvDb = await svd.save();

const svdRemote = new Remote({
	brand: 'svd',
	tv: tvDb._id.toString() /* pilot posiada referencję do _id telewizora w bazie danych */,
});

const remoteControlDb = await svdRemote.save();

const remoteDb = await Remote.find({}).populate('tv');
console.log(remoteDb);
// populate nawiązuje do referencji

const remoteDb2 = await Remote.find({}).populate('tv', '-__v');
console.log(remoteDb2);
// drugi argument mówi co chcemu widzieć,usunąć

const remoteDb3 = await Remote.find({}).populate('tv', ['-__v', '-brand']).select('-__v');
console.log(remoteDb3);
// za pomocą select też możemu ukryć zobaczyćw głównym wyszukiwaniu
