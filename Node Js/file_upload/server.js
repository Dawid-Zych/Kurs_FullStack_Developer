let http = require('http');
let formidable = require('formidable');
let fs = require('fs');

let htmlForm = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
 <form method='post' action='/upload' enctype='multipart/form-data'>
    <input type='file' name='file1'><br>
    <input type='submit' value='wyslij'>
 </post>
</body>
</html>

`;

http.createServer(function (req, res) {
	if (req.url === '/upload') {
		let form = new formidable.IncomingForm();

		form.parse(req, function (err, fields, files) {
			console.log(JSON.stringify(files));

			let tempPath = files.file1.filepath;

			let newPath = './static/' + files.file1.originalFilename;

			fs.rename(tempPath, newPath, function (err) {
				if (err) {
					res.end('file upload error');
				} else {
					res.end(' upload completed');
				}
			});
		});
	} else {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write(htmlForm);
		res.end();
	}
}).listen(8080);
