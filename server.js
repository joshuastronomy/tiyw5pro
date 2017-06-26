const express = require('express');
const session = require('express-session');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const fs = require('fs');

const app = express();

app.engine('mustache', mustacheExpress());
app.set('views', './public');
app.set('view engine', 'mustache');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressValidator());
app.use(express.static(__dirname + '/public'));
//session init
app.use(session({
  secret: 'get dunked kid',
  resave: false,
  saveUninitialized: true
}))

app.get('/', function(req, res) {
  res.render('game');
})

app.listen(3000, function(){
  console.log("MYSTERY WORD online...");
})
