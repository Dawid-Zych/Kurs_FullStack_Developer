// operacje na plikach

let fs = require('fs');

const fileName = './data/newFIle_' + Date.now() + '.txt';

fs.open(fileName, 'w', function (err, file) {
	if (err) {
		throw err;
	} else {
		console.log('Plik został zapisany ' + fileName);
	}
}); //write otwórz plik do zapisu. plik jest tworzony (jeśli nie istnieje) lub obcinany (jeśli istnieje).
