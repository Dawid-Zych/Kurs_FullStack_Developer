const Quote = require('../model/quoteModel');

async function getQuotes() {
	try {
		const quotes = await Quote.getAll();
		return quotes;
	} catch (error) {
		console.log("Can't get quotes in controller!" + error);
		return null;
	}
}

async function getQuote(id) {
	try {
		const quote = Quote.getById(id);
		return quote;
	} catch (error) {
		console.log("Can't get single quote in controller!" + error);
		return null;
	}
}

async function getRandom() {
	try {
		const quotes = await getQuotes();
		if (quotes) {
			return quotes[Math.floor(Math.random() * quotes.length)];
		} else {
			return null;
		}
	} catch (err) {
		console.log("Can't get random quote in controller! " + err);
		return null;
	}
}

async function prepareDB() {
	try {
		const quotes = await getQuotes();
		if (!quotes) {
			const quotesArr = [
				{ quote: 'Knowing yourself is the beginning of all wisdom.', author: 'Aristotle' },
				{ quote: 'No great mind has ever existed without a touch of madness.', author: 'Aristotle' },
				{
					quote: 'Educating the mind without educating the heart is no education at all.',
					author: 'Aristotle',
				},
				{ quote: 'What is a friend? A single soul dwelling in two bodies.', author: 'Aristotle' },
				{ quote: 'Hope is a waking dream', author: 'Aristotle' },
				{ quote: 'Happiness depends upon ourselves.', author: 'Aristotle' },
				{ quote: 'A friend to all is a friend to none.', author: 'Aristotle' },
				{
					quote: 'Wishing to be friends is quick work, but friendship is a slow ripening fruit.',
					author: 'Aristotle',
				},
			];
			await Quote.saveAll(quotesArr);
			console.log('Zapisano początkowe cytaty');
		}
		return;
	} catch (err) {
		console.log("Can't write new quotes!" + err);
		return null;
	}
}

async function deleteById(id) {
	try {
		const quote = await Quote.deleteById(id);
		return quote;
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function updateById(id, quote) {
	try {
		const result = await Quote.updateById(id, quote);
		return result;
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function insertOne(quote) {
	try {
		const result = await Quote.insertOne(quote);
		if (result && result.insertedId) {
			return result;
		} else {
			return null;
		}
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function addOne() {
	try {
		const quote = await Quote.addQuote();
		return quote;
	} catch (error) {
		console.log(error, 'Nie udało się dodać cytatu do kolekcji.');
		return null;
	}
}

module.exports = { prepareDB, getQuote, getQuotes, getRandom, addOne, insertOne, deleteById, updateById };
