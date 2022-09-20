require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
//const cors = require('cors');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

console.log('enviroment', process.env.NODE_ENV);

/*const options = {
  origin: [
    'http://localhost:3010',
    'https://mrnkzrn.nomoredomains.sbs',
    'https://mirankazaryan.github.io',
    'http://mrnkzrn.nomoredomains.sbs',
    'http://mirankazaryan.github.io',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};*/

mongoose.connect('mongodb://localhost:27017/moviedb');
app.use(express.json());
//app.use('*', cors(options));
app.use(requestLogger);
/*app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});*/
app.use(router);
app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT);
