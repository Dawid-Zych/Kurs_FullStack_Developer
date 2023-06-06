/* Funckje middleware mają dostęp do request oraz
 response. Dodatkowo mogą wywołać kolejną funkcję
 middleware jako next kiedy procesowany jest request */

const express = require('express');
const app = express();

app.use(
	(req, res, next) => {
		console.log('middleware request method', req.method, 'url: ', req.url);
		next();
	},
	function (req, res, next) {
		console.log('additional middleware info');
		next();
	},
	function (req, res, next) {
		console.log('additional second middleware info');
		next();
	}
);

app.get('/*', (req, res) => {
	res.status(200).send('Test website');
});

app.listen(8080);
