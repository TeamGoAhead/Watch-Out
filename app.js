var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.use(express.static('public'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


/* FIREBASE */

var firebase = require('firebase-admin');

var watchOutJson = require('./watch-out-key.json');

firebase.initializeApp({
    credential: firebase.credential.cert(watchOutJson),
    databaseURL: "https://watch-out-202610.firebaseio.com"
});

var db = firebase.database();
var ref = db.ref('locations');

ref.on('value', function (snap) {
    console.log(snapshotToArray(snap));
}, function (error) {
    console.log("it didn't work ", error.code)
});

// snapshot to array
function snapshotToArray(snapshot) {
  var returnArr = [];

  snapshot.forEach(function (childSnapshot) {
      var item = childSnapshot.val();
      item.key = childSnapshot.key;

      returnArr.push(item);
  });

  return returnArr;
};

/* END FIREBASE */






app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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


app.listen(5000, function () {
  console.log('app on 5000');
});


module.exports = app;
