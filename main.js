var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var https = require('https');
const mongoose = require('mongoose');
const api = require('./routes/index');
const cors = require('cors')
const MONGO_URL = 'mongodb+srv://MongoBookMark:j1357915@cluster0-ljgc0.mongodb.net/test?retryWrites=true&w=majority';

var index = require('./routes/index');
var bookmark = require('./routes/bookmark');
 
var app = express();
const PORT = 8080;
 
// key define
const optionsForHTTPS = {
  key : fs.readFileSync('keys/private.pem'),
  cert : fs.readFileSync('keys/public.pem')
};

//conncet to mongodb server
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
  console.log('connected mongodb server!');
});

mongoose.connect(MONGO_URL);
 

//bodyParser setting


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', cors());
app.use('/api', api);
 
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

https.createServer(optionsForHTTPS, app).listen(PORT, function(){
  console.log('HTTPS Server Start PORT:' + PORT);
});
 
module.exports = app;
 
