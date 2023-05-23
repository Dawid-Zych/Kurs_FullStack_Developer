/* 
wszystkie funkcje które będą operowały na danych (joke.json)będą tutaj
*/

const jokes = require('../data/jokes.json');

function getAll() {
	return new Promise((resolve, reject) => {
		resolve(jokes);
	});
}

function getById(id) {
	return new Promise((resolve, reject) => {
		const joke = jokes.find(j => j.id === parseInt(id));

		if (joke) {
			resolve(joke);
		} else {
			reject('Joke with id: ' + id + ' not found');
		}
	});
}

module.exports = { getAll, getById };
