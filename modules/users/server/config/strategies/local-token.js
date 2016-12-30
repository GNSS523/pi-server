'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User'),
    jwt = require('jsonwebtoken');

var config = require(path.resolve('./config/env/default.js'));
var secret = config.jwt.secret;

//console.log(')))))))))))))))))))))))))))))))))))))',secret);


module.exports = function() {
    // Use local strategy
    passport.use('local-token', new LocalStrategy({
        usernameField: 'usernameOrEmail',
        passwordField: 'password'
        },
        function(usernameOrEmail, password, done) {

            console.log('local-token',usernameOrEmail,  password)

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
                        message: 'Unknown user'
                    });
                }
                if (!user.authenticate(password)) {
                    console.log('Invalid password')

                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }

                var tokenPayload = {
                    "iss": config.server.domain,
                    "name": user.username,
                    "exp": Math.floor(Date.now()/1000) + config.jwt.maxAge,
                    'iat': Math.floor(Date.now()/1000),
                    'nbf': Math.floor(Date.now()/1000),
                    'roles': user.roles,
                    'amr': ["pwd"],
                    'upn': user.email,
                    'uid': user.uid,
                    //scp: "user_impersonation",
                    //groups: [ "0e129f6b-6b0a-4944-982d-f776000632af" ]
                    ver: "1.0"
                };


                // add token and exp date to user object
                user.loginToken = jwt.sign(tokenPayload, secret);
                user.loginExpires = new Date ( new Date().getTime() + config.jwt.maxAge*1000 ); 

                console.log('local-token.js   ',tokenPayload);
                console.log('local-token.js   ',user.loginToken);

                // save user object to update database
                user.save(function(err) {
                    if(err){
                        done(err);
                    } else {
                        done(null, user);
                    }
                });

            });
        }
    ));
};
