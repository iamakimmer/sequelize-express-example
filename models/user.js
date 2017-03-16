var bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { notEmpty: true}},
    password: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { notEmpty: true}},

    email: { type: DataTypes.STRING, unique: true},

    facebookId: { type: DataTypes.STRING, unique: true},
    facebookRefreshToken: { type: DataTypes.STRING, unique: true},
    facebookAccessToken: { type: DataTypes.STRING, unique: true},

    twitterId: { type: DataTypes.STRING, unique: true},
    twitterToken: { type: DataTypes.STRING, unique: true},
    twitterSecret: { type: DataTypes.STRING, unique: true}

  },{
    classMethods: {
      validPassword: function(password, passwd, callback) {
        console.log('validPassword password', password);
        console.log('validPassword passwd', passwd);
        bcrypt.compare(password, passwd, function(err, isMatch) {
          console.log('isMatch', isMatch);
          if (isMatch) {
            console.log('found match');
            return callback(null, true);
          } else {
            console.log('returning false');
            return callback(null, false);
          }
        });
      }
    }
  }, {
    dialect: 'mysql'
  });

  User.hook('beforeCreate', function(user, {}, next) {

    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) {
          return next(err);
        }  
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
              return next(err);
            }      
            user.password = hash;
            console.log('hash', hash);
            return next(null, user);
        });
    });
  });


  return User;
};