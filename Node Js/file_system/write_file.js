let fs = require('fs');

const filename = './data/writeFile.txt';

fs.writeFile(filename, 'hello again from write js', function (err) {
	if (err) throw err;
	console.log('FIle saved: ' + filename);
});


// writefile jesli istnieje plik to nadpisze go, appendfile dodaje na koniec pliku