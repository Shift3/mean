var express = require('express'),
  path = require('path'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  app = express();

//View rendering, you can rip this out if your creating an API
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.get('/', function (req, res) {
  res.render('index', {welcome: 'Bitwise says hello.'});
});

app.listen(process.env.PORT || 3000, function () {
  console.log(`Server up and running at http://localhost:${process.env.PORT || 3000}`);
});