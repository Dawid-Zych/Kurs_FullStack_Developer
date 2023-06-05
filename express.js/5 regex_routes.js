/* Przykłady ścieżek tras w oparciu o wyrażenia regularne:
Parametry trasy to nazwane segmenty adresów URL, które służą do przechwytywania wartości
 określonych w ich pozycjach w adresie URL. Przechwycone wartości są wypełniane
  w req.params obiekcie, z nazwą parametru trasy określoną w ścieżce jako ich odpowiednie klucze.
*/

const express = require('express');

const app = express();

app.get('/news/:id([0-9]{1,10})', (req, res) => {
	res.status(200).send('Id: ' + req.params.id);
});

app.get('/article/:id(*)', (req, res) => {
	res.status(200).send('Article Id: ' + req.params.id);
});

const handler = (req, res) => {
	res.json({ data: req.params.id });
};

app.get('/api/:id(*)', handler);
app.get('/rest/:id(*)', handler);

app.get('/', (req, res) => {
	res.status(200).send('Strona główna');
});

app.get('*', (req, res) => {
	res.status(404).send('Invalid Url');
});

app.listen(8080);
