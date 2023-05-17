const http = require('http');
const { parse } = require('querystring');

const htmlForm = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form</title>
</head>
<body>
   <form method='POST'>
   Imię: <input type="text" name="name">
   Nazwisko: <input type="text" name="surrname">
   Email: <input type="email" name="email">
   <input type="submit" value="Wyślij">
   </form>
</body>
</html>
`;

http.createServer(function (req, res) {
	let data = ''; // podziemy tu  podawac poszczegolne czesci pobranych danych

	req.on('data', function (chunk) {
		data += chunk; // kolejne porcje danych
	});
	req.on('end', function () {
		// wszystkie dane pobrane

		const parsed = parse(data); // uzyskujemy obiekt w którym sa wszystkie dane,
		console.log(parsed);
		console.log(JSON.stringify(parsed)); // stworzylismy jsona
		res.writeHead(200);
		res.write(htmlForm);
		res.end();
	});
}).listen(8080);
