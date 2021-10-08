import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from  'morgan';
import cors from 'cors';

import indexRouter from './routes/index.js';
import messagesRouter from './routes/messagesRouter.js';
import { findJSESSIONID } from './utils/middlewares.js'

const __dirname = path.resolve();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'jade');

const whiteListedOrigins = [
  'http://localhost:11337',
  'http://127.0.0.1:11337',
  'https://pay.paymentiq.io',
  'https://test-bo.paymentiq.io',
]
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (whiteListedOrigins.includes(req.header('Origin'))) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use((req, res, next) => {
  console.log('My custom middleware, does nothing')
  next()
})
app.use(cors(corsOptionsDelegate));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(findJSESSIONID)

const apiBasePath = '/paymentiq/api-proxy'
app.use('/', indexRouter);
app.use(`${apiBasePath}/messages`, messagesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app