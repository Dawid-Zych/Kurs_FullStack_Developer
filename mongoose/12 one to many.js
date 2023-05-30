import mongoose from 'mongoose';

const url = 'mongodb://127.0.0.1:27017/mongoosetest';
mongoose.connect();

const ownerSchema = mongoose.Schema({
	name: String,
	surname: String,
});

const Owner = mongoose.model('Owner', ownerSchema);

const houseSchema = mongoose.Schema({
	street: String,
	city: String,
	owner: {
		type: mongoose.Types.ObjectId,
		ref: 'Owner', // owner posiada wiele mieszkań, relacja one to many
	},
});

const House = mongoose.model('House', houseSchema);

await House.deleteMany({});
await Owner.deleteMany({});

const ola = await Owner.create({ name: 'Ola', surname: 'Kowalska' });

await House.create({
	street: 'Wilcza 7',
	city: 'Wawa',
	owner: ola,
});

await House.create({
	street: 'Złota 4',
	city: 'Krk',
	owner: ola,
});

const houses = await House.find({}).populate('owner');
console.log(houses);
