const express = require('express');
const app = express();
// tworzymy nowa zmienna requestTime i przypisujemy aktualny czas
app.use((req, res, next) => {
	req.actualTime = Date();
	req.requestTime = Date.now();
	next();
});

app.get('/*', (req, res) => {
	res.status(200).send('Request time: ' + req.requestTime + '<br>' + req.actualTime);
});

app.listen(8080);
