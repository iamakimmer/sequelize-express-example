var passport = require('passport'),
LocalStrategy = require('passport-local'),
db = require('../models');

passport.serializeUser(function(user, done) {
  console.log('serializeUser', user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log('deserializeUser');
  db.User.findById(user.id).then(function(user) {
    done(null, user);
  });
});


passport.use(new LocalStrategy(function(username, password, done) {
  console.log('username', username);
  console.log('password', password);
  db.User.findOne({where: {username: username}}).then(function(user) {
    console.log('user', user);
    if (!user) {
      return done(null, false, { message: 'Incorrect credentials.' })
    }
    var passwd = user ? user.password: '';
    db.User.validPassword(password, passwd, function(err, found) {
      console.log('passport', err, user);
      done(err, found ? user : false);
    });    
  });
}));
