/*  
W express js mozemy korzystać również z szablonów czyli w praktyce
będą to odziellne pliki z kodem html i minimalna ilością logiki do
generowania tego kodu html dla odpowiedzi z serwera. Czyli oddzielimy
sobie naszą główną logike naszej aplikacji serwera od szablonu który
będzie miał generowany html. Skorzystamy tu z dodatku ejs czyli
Embedded JavaScript templates
    npm install ejs

Dodajemy kilka folderów i plików
ejs.test.js
/views {
    /pages : /home.ejs
    /template: /head.ejs
}
/public
*/

const express = require('express');
const path = require('path');
const app = express();

// __dirname - aktualny katalog
const viewsPath = path.join(__dirname, 'views');
console.log('viewsPath', viewsPath);

//informujemy express.js odnosnie sciezki do katalogi i jaki uzywamy viewEngine
app.set('views', viewsPath);
app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.get('/', (req, res) => {
	res.render('pages/home', {
		pageHeading: 'Hello World' + req.url,
	});
});

const links = [
	{ url: '/', name: 'Home' },
	{ url: '/articles', name: 'Articles' },
	{ url: '/tos', name: 'TOS' },
];

app.get('/loop', (req, res) => {
	res.render('pages/loop', {
		pageHeading: 'Hello World' + req.url,
		links: links,
	});
});

app.listen(8080);
