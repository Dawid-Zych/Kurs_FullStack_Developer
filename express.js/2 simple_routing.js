/*  	Prosty routing	
routing odnosi się do określenia, w jaki sposób aplikacja odpowiada na żądanie klienta skierowane do określonego punktu końcowego, którym jest uri (lub ścieżka) i określona metoda żądania http (get, post itd.). każda trasa może mieć jedną lub więcej funkcji obsługi, które są wykonywane, gdy trasa jest dopasowana.
 definicja trasy ma następującą strukturę: app.METHOD(PATH, HANDLER)
*/
const express = require('express');

const app = express();

app.post('/post', (req, res) => {
	res.send('Got a POST request');
});

app.get('/page1', (req, res) => {
	res.status(200).send('Strona 1');
});

app.post('/post', (req, res) => {
	res.status(200).send('Form data!');
});

app.get('/testjson', (req, res) => {
	console.log('JSON');
	res.json({
		data: 'Hello from server in JSON!',
	});
});

app.all('/all', (req, res) => {
	res.status(200).send('Form data!');
});

app.listen(8080, () => {
	console.log('Server started!');
});
