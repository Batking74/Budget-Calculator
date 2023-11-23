const express = require('express');
const api = require('./routes/SetAside');
const { PORT } = require('./database');
const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use('/', api);

// Server Port
app.listen(PORT, () => {
    console.log('Listening on port 7000');
})