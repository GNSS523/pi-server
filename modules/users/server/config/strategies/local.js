'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('mongoose').model('User');

module.exports = function () {
  // Use local strategy
  passport.use(new LocalStrategy({
    usernameField: 'usernameOrEmail',
    passwordField: 'password'
  },
  function (usernameOrEmail, password, done) {

    console.log(usernameOrEmail,password);

    User.findOne({
      $or: [{
        username: usernameOrEmail.toLowerCase()
      }, {
        email: usernameOrEmail.toLowerCase()
      }]
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: 'Uknown user (' + (new Date()).toLocaleTimeString() + ')'          
        });
      }else if(!user.authenticate(password)){
        return done(null, false, {
          message: 'Invalid  password (' + (new Date()).toLocaleTimeString() + ')'          
        });        
      }

      return done(null, user);
    });
  }));
};
