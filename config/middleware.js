exports.authenticated = function(req, res, next) {
  console.log('in is authenticated', req.isAuthenticated());
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
};

exports.destroySession = function(req, res, next) {
  req.logOut();
  req.session.destroy();
  res.redirect('/');
};
