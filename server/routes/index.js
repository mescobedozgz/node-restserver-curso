const express = require('express');
const app = express();

app.use(require('./users'));
app.use(require('./categories'));
app.use(require('./products'));
app.use(require('./upload'));
app.use(require('./images'));
app.use(require('./login'));

module.exports = app;
