const http = require('http');
const {
	getQuotes,
	getQuote,
	getRandom,
	prepareDB,
	addOne,
	updateById,
	deleteById,
	insertOne,
} = require('./controllers/quoteController');
const { serveStaticFile } = require('./util/staticServer');

const port = 7000;
const API_CONTENT_TYPE = { 'Content-Type': 'application/json' };

const server = http.createServer(async function (req, res) {
	console.log('Request');
	await prepareDB();

	if (req.url === '/api/quotes' && req.method === 'GET') {
		const quotes = await getQuotes();
		if (quotes) {
			res.writeHead(200, API_CONTENT_TYPE);
		} else {
			res.writeHead(404, API_CONTENT_TYPE);
			quotes = { message: 'Quotes not found' };
		}

		res.end(JSON.stringify(quotes));
	} else if (req.url === '/api/quotes/random' && req.method === 'GET') {
		let quote = await getRandom();
		// console.log(quote);
		if (quote) {
			res.writeHead(200, API_CONTENT_TYPE);
		} else {
			res.writeHead(404, API_CONTENT_TYPE);
			quote = { messege: 'Random quotes not found' };
		}
		res.end(JSON.stringify(quote));
	} else if (req.url === '/api/quotes/add' && req.method === 'GET') {
		let quote = await addOne();
		console.log(quote);
		if (quote) {
			res.writeHead(200, API_CONTENT_TYPE);
		} else {
			res.writeHead(404, API_CONTENT_TYPE);
			quote = { messege: 'Random quote not found' };
		}
		res.end(JSON.stringify(quote));
	} else if (req.url.match(/\/api\/quote\/([0-9a-z]+)/)) {
		const id = req.url.split('/')[3];
		let quote = await getQuote(id);

		if (quote) {
			res.writeHead(200, API_CONTENT_TYPE);
			console.log(quote, 'zwracam');
		} else {
			res.writeHead(404, API_CONTENT_TYPE);
			quote = { message: 'Quote by id not found' };
		}

		res.end(JSON.stringify(quote));
	} else if (req.url === '/api/quotes/save' && req.method === 'POST') {
		let data = '';

		req.on('data', function (chunk) {
			data += chunk;
		});

		req.on('end', async function () {
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
		});
	} else if (req.url === '/api/quotes/delete' && req.method === 'POST') {
		let data = '';

		req.on('data', function (chunk) {
			data += chunk;
		});

		req.on('end', async function () {
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
		});
	} else if (req.url === '/api/quotes/update/one' && req.method === 'POST') {
		let data = '';

		req.on('data', function (chunk) {
			data += chunk;
		});

		req.on('end', async function () {
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
		});
	} else {
		serveStaticFile(req, res);
	}
});

server.listen(port, function (err) {
	console.log(err) + ' Nie udało się połączyć z serwerem';
});
