var passport = require('passport'),
LocalStrategy = require('passport-local'),
FacebookStrategy = require('passport-facebook'),
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


passport.use(new FacebookStrategy({
    clientID: '421818958150614',
    clientSecret: 'fc7509e4ae6c9347f8a067b5c8a7f883',
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('profile', profile);
    db.User.findOne({where: {facebookId: profile.id}}).then(function(user) {
      if (!user) {
        db.User.create({facebookRefreshToken: refreshToken, facebookAccessToken: accessToken, facebookId: profile.id, username: profile.username || profile.emails[0].value, password: 'some random password hash' }).then(function(user) {
          done(null, user);
        }).catch(function(err) {
          console.log('err', err);
          done(err, false);
        });

      } else {
        done(err, found ? user : false);
      }
    });
  }
));
