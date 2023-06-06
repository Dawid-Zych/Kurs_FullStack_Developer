const express = require('express');
const app = express();

/* Możemy zdecydować w naszym middleware że z jakiegoś powodu chcemy przekazać 
obsługe zapytania do innej funkcji middleware która będzie również reagowa na ten sam url
właśnie za pomocą next() z argumentem 'route' */

app.get(
	'/user/:id',
	function (req, res, next) {
		if (req.params.id === '0') {
			next('route');
		} else {
			next();
		}
	},
	function (req, res, next) {
		res.send('Some response with id: ' + req.params.id);
	}
);

app.get('/user/:id', function (req, res, next) {
	res.send('Another response for user id: ' + req.params.id);
});

app.listen(8080);
