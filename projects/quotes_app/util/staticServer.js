const fs = require('fs');
const path = require('path');

const mimeTypes = {
	'.html': 'text/html', // Typ MIME dla plików HTML
	'.js': 'text/javascript', // Typ MIME dla plików JavaScript
	'.json': 'application/json', // Typ MIME dla plików JSON
	'.css': 'text/css', // Typ MIME dla plików CSS
	'.jpg': 'image/jpeg', // Typ MIME dla plików JPEG
	'.png': 'image/png', // Typ MIME dla plików PNG
};

function serveStaticFile(req, res) {
	const baseURL = req.protocol + '://' + req.headers.host + '/'; // Bazowy URL żądania
	const parsedURL = new URL(req.url, baseURL); // Parsowanie URL-a

	let pathSanitize = path.normalize(parsedURL.pathname); // Normalizacja ścieżki

	let pathname = path.join(__dirname, '..', 'static', pathSanitize); // Pełna ścieżka pliku

	fs.access(pathname, fs.constants.F_OK, err => {
		if (err) {
			// Plik nie istnieje - zwróć kod błędu 404 i komunikat
			res.statusCode = 404;
			res.end('File not found');
		} else {
			if (fs.statSync(pathname).isDirectory()) {
				// Jeśli ścieżka jest katalogiem, dodaj '/index.html' na końcu
				pathname += '/index.html';
			}

			fs.readFile(pathname, function (err, data) {
				if (err) {
					// Błąd odczytu pliku - zwróć kod błędu 500 i komunikat
					res.statusCode = 500;
					res.end('File not found: ' + err);
				} else {
					const extension = path.parse(pathname).ext; // Rozszerzenie pliku
					const contentType = mimeTypes[extension] || 'application/octet-stream'; // Typ MIME pliku lub domyślny typ MIME

					res.setHeader('Content-Type', contentType); // Ustawienie nagłówka 'Content-Type' w odpowiedzi
					res.end(data); // Wysłanie danych pliku jako odpowiedź
				}
			});
		}
	});
}

module.exports = {
	serveStaticFile,
};
