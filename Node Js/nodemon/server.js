const http = require('http');

const server = http.createServer(async (req, res) => {
	console.log('request');

	res.writeHead(200);
	res.end('Hello Worlda 2!');
});

server.listen(8080);
