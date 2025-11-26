const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth');
const medRouter = require('./routes/medicines');
const saleRouter = require('./routes/sales');
const bodyParser = require('express').json;

const app = express();
app.use(cors());
app.use(bodyParser());

app.use('/api/auth', authRouter);
app.use('/api/medicines', medRouter);
app.use('/api/sales', saleRouter);

app.get('/', (req, res) => res.send('Pharmacy Billing API'));

module.exports = app;
