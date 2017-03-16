var express = require('express'),
routes = require('./routes'),
app = express(),
db = require('./models'),
passport = require('passport'),
passportConfig = require('./config/passport');
var exphbs  = require('express-handlebars');

var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session');
var errorhandler = require('errorhandler');

app.use('/public', express.static(__dirname + '/public'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const PORT = process.env.PORT || 3000;

app.set('port', PORT);

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));


app.use(cookieParser())
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: '3or8h1o2h1o28u12o38j12',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);

if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorhandler())
}


db.sequelize.sync({ force: true }).then(function() {
  // db.User.find({where: {username: 'matt'}}).then(function(user) {
  //   if (!user) {
  //     db.User.create({username: 'admin', password: 'admin'});
  //   }
  // })
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});