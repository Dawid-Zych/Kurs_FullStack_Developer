import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';

const mimeTypes = {
	'.html': 'text/html', // Typ MIME dla plików HTML
	'.js': 'text/javascript', // Typ MIME dla plików JavaScript
	'.json': 'application/json', // Typ MIME dla plików JSON
	'.css': 'text/css', // Typ MIME dla plików CSS
	'.jpg': 'image/jpeg', // Typ MIME dla plików JPEG
	'.png': 'image/png', // Typ MIME dla plików PNG
	'.map': 'application/json',
};

export function serveStaticFile(req, res) {
	const baseUrl = req.protocol + '://' + req.headers.host + '/';
	//: Ta linia tworzy zmienną baseUrl, która reprezentuje bazowy URL, na którym serwer jest uruchomiony. Wykorzystuje ona właściwości obiektu req (request), takie jak protocol (protokół używany w żądaniu, np. "http" lub "https") i headers.host (adres hosta, na którym zostało wysłane żądanie).

	const parsedURL = new URL(req.url, baseUrl);
	//Ta linia tworzy obiekt parsedURL, który reprezentuje analizowany URL. Wykorzystuje konstruktor URL i przekazuje mu dwa argumenty: req.url (ścieżka URL z obiektu żądania) i baseUrl (bazowy URL utworzony w poprzedniej linii).

	let pathSanitize = path.normalize(parsedURL.pathname);
	//Ta linia tworzy zmienną pathSanitize, która przechowuje znormalizowaną ścieżkę z parsedURL.pathname. Wykorzystuje ona funkcję normalize z modułu path, która usuwa znaki specjalne i podwójne ukośniki oraz normalizuje ścieżkę.

	const __filename = url.fileURLToPath(import.meta.url);
	/*     import.meta.url jest specjalnym obiektem dostępnym w module ES6/ESM w Node.js, który zawiera informacje na temat importowanego modułu.
    url.fileURLToPath to funkcja dostępna w modułach url w Node.js, która konwertuje URL pliku na ścieżkę systemową.
    __filename to zmienna, do której przypisujemy ścieżkę pliku na podstawie import.meta.url za pomocą url.fileURLToPath. */

	const __dirname = path.dirname(__filename);
	console.log('pathSanitize: ' + pathSanitize);
	console.log('__dirname: ' + __dirname);

	let pathname = path.join(__dirname, '..', 'static', pathSanitize);
	console.log('pathname: ' + pathname);
	/*     __filename jest zmienną specjalną dostępną w środowisku Node.js, która zawiera pełną ścieżkę do bieżącego pliku.
    path to moduł wbudowany w Node.js, który udostępnia różne funkcje do pracy ze ścieżkami plików.
    path.dirname() jest funkcją, która przyjmuje ścieżkę do pliku i zwraca ścieżkę do katalogu nadrzędnego, czyli katalogu, w którym znajduje się dany plik. */

	/* obsługa żądania HTTP, w której sprawdzane jest istnienie pliku o podanej ścieżce pathname. Jeśli plik istnieje, jest odczytywany i zwracany w odpowiedzi HTTP. Jeśli plik nie istnieje, zwracana jest odpowiedź HTTP o kodzie 404 - "Not Found". */
	if (fs.existsSync(pathname)) {
		// Sprawdza, czy plik o podanej ścieżce pathname istnieje w systemie plików. zwraca wartość logiczną (true lub false).
		if (fs.statSync(pathname).isDirectory()) {
			//: Sprawdza, czy plik jest katalogiem. fs.statSync(pathname) zwraca obiekt fs.Stats, który zawiera informacje o pliku. Metoda isDirectory() na obiekcie fs.Stats zwraca wartość logiczną (true lub false) w zależności od tego, czy ścieżka reprezentuje katalog.
			pathname += '/index.html';
		}

		fs.readFile(pathname, function (err, data) {
			// Odczytuje zawartość pliku o podanej ścieżce pathname. Funkcja fs.readFile() odczytuje plik asynchronicznie i wywołuje przekazaną funkcję zwrotną, która przyjmuje dwa argumenty: err (błąd, jeśli wystąpił) i data (dane odczytane z pliku).
			if (err) {
				res.statusCode = 500;
				res.end('Błąd podczas odczytu pliku');
				//Sprawdza, czy wystąpił błąd podczas odczytu pliku. Jeśli tak, ustawia kod odpowiedzi HTTP na 500 (błąd serwera)
			} else {
				const extension = path.parse(pathname).ext;
				//Pobiera rozszerzenie pliku na podstawie ścieżki pathname. Wykorzystuje funkcję path.parse() do analizy ścieżki i pobrania obiektu z informacjami o ścieżce. Następnie używa właściwości ext do uzyskania samego rozszerzenia pliku.
				console.log(extension);

				res.setHeader('Content-type', mimeTypes[extension]);

				//Ustawia nagłówek HTTP "Content-type" na podstawie rozszerzenia pliku.Korzysta z obiektu mimeTypes, który mapuje rozszerzenia plików na typy MIME.
				res.end(data);
				//Zwraca zawartość odczytanego pliku w odpowiedzi HTTP.
			}
		});
	} else {
		res.statusCode = 404;
		res.end('Plik o podanej ścieżce nie istnieje');
		//res.statusCode = 404;: Jeśli plik o podanej ścieżce pathname nie istnieje (na podstawie pierwszego warunku), ustawia kod odpowiedzi HTTP
	}
}

/* definiuje funkcję serveJsonObj, która służy do obsługi żądania HTTP i wysyłania odpowiedzi w formacie JSON.
Funkcja serveJsonObj pozwala na wysłanie odpowiedzi w formacie JSON na podstawie dostępnych danych. 
Jeśli dane są dostępne, odpowiedź ma kod stanu 200 i zawiera dane w formacie JSON. 
Jeśli dane nie są dostępne, odpowiedź ma kod stanu 504 (np. w przypadku problemów z połączeniem
     z zewnętrznym źródłem danych) i zawiera pusty obiekt JSON. */

export function serveJsonObj(res, objData) {
	//przyjmuje dwa parametry: res (obiekt odpowiedzi HTTP) i objData (dane w formacie obiektu, które zostaną przekonwertowane na JSON i wysłane w odpowiedzi).
	if (objData) {
		//Sprawdza, czy objData istnieje i ma wartość. Jeśli tak, oznacza to, że są dostępne dane do wysłania w odpowiedzi.
		res.writeHead(200, mimeTypes['.json']);
		//: Ustawia nagłówek HTTP dla odpowiedzi na kod stanu 200 (OK) i typ zawartości na JSON. Wydaje się, że korzysta z obiektu mimeTypes, który mapuje rozszerzenia plików na typy MIME.
	} else {
		//Jeśli objData nie istnieje lub ma wartość falsy (np. null, undefined, pusty obiekt), wykonuje się ten blok kodu.
		res.writeHead(404, mimeTypes['.json']);
		// Ustawia nagłówek HTTP dla odpowiedzi na kod stanu 504 (Gateway Timeout) i typ zawartości na JSON.
	}

	res.end(JSON.stringify(objData));
	// Konwertuje objData na ciąg JSON za pomocą JSON.stringify() i wysyła go jako treść odpowiedzi HTTP.
}

/* definiuje funkcję getPostData, która służy do pobierania danych z żądania HTTP typu POST.
 Funkcja zwraca obietnicę, która zostanie rozwiązana z danymi przesłanymi przez klienta. */
export async function getPostData(req) {
	//Służy do pobierania danych z żądania HTTP typu POST. Funkcja zwraca obietnicę, która zostanie rozwiązana z danymi przesłanymi przez klienta.
	return new Promise((resolve, reject) => {
		let data = '';
		req.on('data', function (chunk) {
			data += chunk;
		});
		// Rejestruje zdarzenie 'data' na obiekcie żądania req, które zostanie wywołane, gdy dane będą dostępne.
		// Do zmiennej data dodaje otrzymaną porcję danych (chunk).

		req.on('end', function () {
			//Rejestruje zdarzenie 'end' na obiekcie żądania req, które zostanie wywołane, gdy przesyłanie danych zostanie zakończone

			const parsedData = JSON.parse(data);
			// Parsuje otrzymane dane z formatu JSON na obiekt JavaScript za pomocą JSON.parse(). Otrzymany obiekt jest przypisywany do zmiennej parsedData.

			resolve(parsedData);
			// Rozwiązuje obietnicę, przekazując jako rezultat sparsowane dane (parsedData).
		});
	});
}
