const express = require('express');
const session = require('express-session');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const fs = require('fs');

const app = express();



app.engine('mustache', mustacheExpress());
app.set('views', './views');
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

app.use(function(req, res, next) {
  if (!req.session.game) {
    req.session.game = {};

    req.session.game.words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

  }
  next();
})


app.get('/', function(req, res) {

  if (!req.session.game.wordArr) {

    const words = req.session.game.words;

    let randWord = words[Math.floor(Math.random() * words.length)];

    console.log(randWord);

    let gameArr = [];

    for (let idx = 0; idx < randWord.length; idx++) {
      gameArr.push("_");
    }

    let wordArr = randWord.split("");

    let deadLetters = [];

    let gameLives = 8;

    req.session.game.gameArr = gameArr;
    req.session.game.wordArr = wordArr;
    req.session.game.deadLetters = deadLetters;
    req.session.game.gameLives = gameLives;

    console.log(gameArr);
    console.log(wordArr);
    console.log(deadLetters);
    console.log(gameLives);

  }

  res.render('game', req.session.game);

})

app.post('/', function(req, res) {

  console.log(req.session.game.deadLetters);
  const wordArr = req.session.game.wordArr;
  const gameArr = req.session.game.gameArr;
  let guessedLetter = req.body.playerGuess;

  console.log(guessedLetter);

  let deadLet = req.session.game.deadLetters;

  if (deadLet.indexOf(guessedLetter) >= 0) {
    console.log('You done goofed');
    res.redirect('/');
  } else {
    for (let idx in wordArr) {
      if (guessedLetter === wordArr[idx]) {
        // req.session.game.gameArr.splice(idx, 1, guessedLetter);
        gameArr[idx] = wordArr[idx];
        console.log(gameArr);
        if (deadLet.indexOf(guessedLetter) < 0) {
          deadLet.push(guessedLetter);
        }
      }
    }
    if (wordArr.indexOf(guessedLetter) < 0) {
      deadLet.push(guessedLetter);
      req.session.game.gameLives--;
    }
  }
  res.redirect('/');
});

app.listen(3000, function() {
  console.log("MYSTERY WORD online...");
})
