const http = require('http');
const {
	getQuotes,
	getQuote,
	getRandom,
	prepareDB,
	addNewQuote,
	updateById,
	deleteById,
	insertOne,
} = require('./controllers/quoteController');

const { serveStaticFile } = require('./util/staticServer');

const port = 7000;
const API_CONTENT_TYPE = { 'Content-Type': 'application/json' };

const server = http.createServer(async function (req, res) {
	console.log('Request');

	if (req.url === '/api/quotes' && req.method === 'GET') {
		try {
			const quotes = await getQuotes();
			if (quotes) {
				res.writeHead(200, API_CONTENT_TYPE);
				res.end(JSON.stringify(quotes));
			} else {
				res.writeHead(404, API_CONTENT_TYPE);
				res.end(JSON.stringify({ message: 'Quotes not found, preparing new quotes, refresh page' }));
				await prepareDB();
			}
		} catch (error) {
			console.log("Can't get quotes in controller!" + error);
			res.writeHead(500, API_CONTENT_TYPE);
			res.end(JSON.stringify({ message: 'Internal Server Error' }));
		}
	} else if (req.url === '/api/quotes/random' && req.method === 'GET') {
		try {
			const quote = await getRandom();
			if (quote) {
				res.writeHead(200, API_CONTENT_TYPE);
				res.end(JSON.stringify(quote));
			} else {
				res.writeHead(404, API_CONTENT_TYPE);
				res.end(JSON.stringify({ message: 'Random quote not found, preparing new quotes, refresh page' }));
				await prepareDB();
			}
		} catch (error) {
			console.log("Can't get random quote in controller! " + error);
			res.writeHead(500, API_CONTENT_TYPE);
			res.end(JSON.stringify({ message: 'Internal Server Error' }));
		}
	} else if (req.url === '/api/quotes/add' && req.method === 'GET') {
		try {
			const quote = await addNewQuote();
			if (quote) {
				res.writeHead(200, API_CONTENT_TYPE);
				res.end(JSON.stringify(quote));
			} else {
				res.writeHead(404, API_CONTENT_TYPE);
				res.end(JSON.stringify({ message: 'Random quote not found' }));
			}
		} catch (error) {
			console.log(error, 'Nie udało się dodać cytatu do kolekcji.');
			res.writeHead(500, API_CONTENT_TYPE);
			res.end(JSON.stringify({ message: 'Internal Server Error' }));
		}
	} else if (req.url.match(/\/api\/quote\/([0-9a-z]+)/)) {
		const id = req.url.split('/')[3];
		try {
			const quote = await getQuote(id);
			console.log(quote);
			if (quote) {
				res.writeHead(200, API_CONTENT_TYPE);
				res.end(JSON.stringify(quote));
			} else {
				res.writeHead(404, API_CONTENT_TYPE);
				res.end(JSON.stringify({ message: 'Quote by id not found' }));
			}
		} catch (error) {
			console.log("Can't get single quote in controller!" + error);
			res.writeHead(500, API_CONTENT_TYPE);
			res.end(JSON.stringify({ message: 'Internal Server Error' }));
		}
	} else if (req.url === '/api/quotes/save' && req.method === 'POST') {
		let data = '';

		req.on('data', function (chunk) {
			data += chunk;
		});

		req.on('end', async function () {
			try {
				const quote = JSON.parse(data);
				let response = {};
				const result = await insertOne(quote);
				console.log(result);
				if (result) {
					res.writeHead(200);
					response = { saved: true, _id: result.insertedId };
				} else {
					res.writeHead(404);
					response = { saved: false, _id: null };
				}

				res.end(JSON.stringify(response));
			} catch (error) {
				console.log("Can't save quote in controller!" + error);
				res.writeHead(500, API_CONTENT_TYPE);
				res.end(JSON.stringify({ message: 'Internal Server Error' }));
			}
		});
	} else if (req.url === '/api/quotes/delete' && req.method === 'POST') {
		let data = '';

		req.on('data', function (chunk) {
			data += chunk;
		});

		req.on('end', async function () {
			try {
				const quote = JSON.parse(data);
				if (!quote || !quote._id) {
					res.end(JSON.stringify({ message: 'Bad id' }));
					return;
				}

				let response = {};
				const result = await deleteById(quote._id);
				if (result && result.deletedCount > 0) {
					res.writeHead(200);
					response = { deleted: true };
				} else {
					res.writeHead(404);
					response = { deleted: false };
				}

				res.end(JSON.stringify(response));
			} catch (error) {
				console.log("Can't delete quote in controller!" + error);
				res.writeHead(500, API_CONTENT_TYPE);
				res.end(JSON.stringify({ message: 'Internal Server Error' }));
			}
		});
	} else if (req.url === '/api/quotes/update/one' && req.method === 'POST') {
		let data = '';

		req.on('data', function (chunk) {
			data += chunk;
		});

		req.on('end', async function () {
			try {
				const quote = JSON.parse(data);
				let response = {};
				const result = await updateById(quote);

				console.log(result);
				if (result) {
					res.writeHead(200);
					response = { updated: true };
				} else {
					res.writeHead(404);
					response = { updated: false };
				}

				res.end(JSON.stringify(response));
			} catch (error) {
				console.log("Can't update quote in controller!" + error);
				res.writeHead(500, API_CONTENT_TYPE);
				res.end(JSON.stringify({ message: 'Internal Server Error' }));
			}
		});
	} else {
		serveStaticFile(req, res);
	}
});

server.listen(port, function (err) {
	if (err) {
		console.log('Nie udało się połączyć z serwerem');
	} else {
		console.log(`Serwer nasłuchuje na porcie ${port}`);
	}
});
