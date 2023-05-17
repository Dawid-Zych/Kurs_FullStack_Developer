const fs = require('fs');

const filename = './data/appendFile.txt';

fs.appendFile(filename, 'Hello World', function (err) {
	if (err) throw err;
	console.log('FIle saved: ' + filename);
});
