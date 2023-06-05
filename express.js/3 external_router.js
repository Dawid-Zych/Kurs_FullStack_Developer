/* załaduj moduł routera w aplikacji: */
const express = require('express');
const testRouter = require('./3.1 test_router');
const testRouter2 = require('./3.1 test_router2');

const app = express();

app.use('/', testRouter);
app.use('/test', testRouter2);

app.listen(8080);
