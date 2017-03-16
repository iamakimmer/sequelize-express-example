const routes = require('express').Router();
const middleware = require('../config/middleware');
const passport = require('passport');
const db = require('../models');

routes.get('/', (req, res) => {
  res.render('home');
});

routes.get('/dashboard', function(req, res, next) {
  console.log('going to dashboard'); next(null);
}, middleware.authenticated, function(req, res) {
  res.render('dashboard');
});


//login a new user
routes.post('/authenticate', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}));


routes.get('/logout', middleware.destroySession);

routes.get('/login', function(req, res) {
  res.render('login');
});

routes.get('/signup', function(req, res) {
  res.render('signup');
});

//create a new user
routes.post('/signup', function(req, res) {
  db.User.find({where: {username: req.userrname}}).then(function(user) {
    if (!user) {
      db.User.create({username: req.body.username, password: req.body.password}).then(function() {
        req.logIn();
        res.redirect('/dashboard');
      }).catch(function(err) {
        res.redirect('/signup');
      });
    }
  });
});


module.exports = routes;