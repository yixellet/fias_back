require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const { API_PORT } = require('./config');

const app = express();
app.use(routes)
app.listen(API_PORT);