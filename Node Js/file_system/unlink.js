let fs = require('fs');

const filename = './data/writeFile.txt';

fs.unlink(filename, function (err) {
	if (err) throw err;
	console.log('File removed' + filename);
});
