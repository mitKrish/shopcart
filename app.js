var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var cors = require('cors');
var morgan = require('morgan');
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');

require('./models/users');
require('./services/passport');

var routesApi = require('./routes/index');
var keys = require('./config/keys');

var app = express();

mongoose
  .connect(keys.mongoURI)
  .then(() => console.log('Connection Successful'))
  .catch(err => console.log(err));

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
  flags: 'a'
});

app.use(morgan('combined', { stream: accessLogStream }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(cors());

app.use(passport.initialize());
app.use('/api', routesApi);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});
*/

//Unauthorized errors
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({ message: err.name + ': ' + err.message });
  }
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

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
