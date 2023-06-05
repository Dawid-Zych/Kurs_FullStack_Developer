/* Prosty serwer na Express.js */

const express = require('express');

const app = express();

app.get('/', (req, res) => {
	res.status(200).send('Hello from Express.js');
});

app.listen(8080, () => {
	console.log('Server started!');
});
