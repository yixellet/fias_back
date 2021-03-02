require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { API_PORT } = require('./config');

const app = express();
app.use('*', cors({
  origin: ['http://localhost:3000', '*'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: [
    'Content-Type',
    'origin',
    'x-access-token',
    'authorization',
    'credentials',
  ],
  credentials: true,
}));
app.use(routes);
app.listen(API_PORT);
