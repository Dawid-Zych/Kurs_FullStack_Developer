// uzyskujemy informacje o naszych zapytaniach

const http = require('http');
const url = require('url');

http.createServer(function (req, res) {
	res.writeHead(200, { 'Content-type': 'text/html' });
	res.write('req.url: ' + req.url + '<br>');
	console.log(req);
	let parsedUrl = url.parse(req.url, true);
	console.log(parsedUrl);
	res.write('parserUrl.pathname: ' + parsedUrl.pathname + ' <br>');
	let json = JSON.stringify(parsedUrl);
	res.write(json + '<br>');
	res.end();
}).listen(8080);
