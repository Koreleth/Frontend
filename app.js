var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var equipmentRouter = require('./routes/equipment');
var loginRouter = require('./routes/login');
var borrowsRouter = require('./routes/borrows.js');

var flash = require('connect-flash');

var app = express();

app.use(session({
  secret: 'your_secret_key', // Ersetze dies durch einen eigenen geheimen Schlüssel
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 3600000
  } // Setze auf true, wenn du HTTPS verwendest
}));
app.use(flash());

app.use(function (req, res, next) {
  if (!req.session.isInitialized) {
    req.session.isInitialized = true; // Setze eine benutzerdefinierte Variable
  }
  next();
});

// Middleware zum Setzen von lokalen Variablen
app.use(function (req, res, next) {
  res.locals.info = req.flash('info');
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.warning = req.flash('warning');

  next();
});




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const fileUpload = require('express-fileupload');
app.use(fileUpload({
  createParentPath: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('public/uploads'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/equipment', equipmentRouter);
app.use('/login', loginRouter);
app.use('/borrows', borrowsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
