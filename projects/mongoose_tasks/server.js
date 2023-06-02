import http from 'http';
import { handleRequest } from './routes.js';
const PORT = '8080';

const server = http.createServer(async (req, res) => {
	await handleRequest(req, res);
});

server.listen(PORT, () => {
	console.log('Start serwera');
});
