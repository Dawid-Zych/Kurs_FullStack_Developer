/* 
obsługa sesji dzięki cookie, informacje w przeglądarce
npm install cookie-session
 */
const cookieSession = require('cookie-session');
const express = require('express');
const app = express();

app.use(
	cookieSession({
		name: 'session',
		keys: ['key1', 'key2'],
	})
);

//niszczymy sesje przez null
app.get('/*', (req, res) => {
	console.log('request.url ', req.url);
	if (!req.session.views) req.session.views = 0;
	if (!req.url.endsWith('favicon.ico')) req.session.views++;
	if (req.session.views >= 30) {
		req.session = null;
		req.session = {
			views: 1,
		};
	}

	res.end('VIews count: ' + req.session.views);
});

app.listen(8080);
