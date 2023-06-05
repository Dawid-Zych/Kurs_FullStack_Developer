const express = require('express');

const app = express();

app.get('/article/:date/:title', (req, res) => {
	res.status(200).send('Date: "' + req.params.date + ' title: ' + req.params.title);
});
//http://127.0.0.1:8080/article/2020-12-12/hello
// Date: "2020-12-12" title: hello

app.get('/file/:id', (req, res) => {
	res.status(200).send('File id: ' + req.params.id);
});

//http://127.0.0.1:8080/file/23
//File id: 23
app.listen(8080);
