const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const api = require('./routes/index');
const cors = require('cors')
const MONGO_URL = 'mongodb+srv://MongoBookMark:j1357915@cluster0-ljgc0.mongodb.net/test?retryWrites=true&w=majority';

//conncet to mongodb server
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
  console.log('connected mongodb server!');
});
 
mongoose.connect(MONGO_URL);
 
const port = 4000;
 
//bodyParser setting
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use('/api', cors());
app.use('/api', api);
 
app.listen(port, () => {
  console.log('Express is listening on port', port);
});