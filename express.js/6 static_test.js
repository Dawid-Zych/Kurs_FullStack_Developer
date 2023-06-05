/* 
Express js upraszcza nam serwowanie plików statycznych
Wskazujemy naszemu serwerowi które foldery ma użyć

express.static(root, [options]) 

*/

const express = require('express');
const app = express();

app.use('/images', express.static('images'));
//http://127.0.0.1:8080/images/bird.jpg

/* app.use(express.static('images'));
http://127.0.0.1:8080/bird.jpg */

app.listen(8080);
