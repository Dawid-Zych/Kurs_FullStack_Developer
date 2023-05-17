const http = require('http');
const url = require('url'); // zeby wiedziec ktory plik html odczytac z systemu plików
const fs = require('fs'); // file stystem,możliwość odczytania plików na serwerze

http.createServer(handleRequest).listen(8080, '127.0.0.1');

function handleRequest(req, res) {
	res.writeHead(200, { 'Content-type': 'text/html' });

	//    /test.html
	const pathname = url.parse(req.url, true).pathname;
	const filename = './static' + pathname;

	fs.readFile(filename, function (err, data) {
		if (err) {
			res.writeHead(404, { 'Content-type': 'text/html' });
			return res.end('404 file not found');
		}

		res.write(data);
		res.end();
	});
}
