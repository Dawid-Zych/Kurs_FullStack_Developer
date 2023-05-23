/*  bedzie kontrolował wszystko, logika odnosnie danych żartów */

const Joke = require('../model/jokeModel');

async function getJokes() {
	try {
		const jokes = await Joke.getAll();
		return jokes;
	} catch (error) {
		console.log(error);
		return null;
	}
}

async function getJoke(id) {
	try {
		const joke = await Joke.getById(id);
		return joke;
	} catch (error) {
		console.log(error);
		return null;
	}
}

async function getRandom() {
	try {
		const jokes = await getJokes();
		if (jokes) {
			return jokes[Math.floor(Math.random() * jokes.length)];
		} else {
			return null;
		}
	} catch (error) {
		console.log(error);
		return null;
	}
}

module.exports = {
	getJokes,
	getRandom,
	getJoke,
};
