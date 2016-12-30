'use strict';
/**
 * Module dependencies
 */
var path = require('path'),
  chalk = require('chalk'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User'),
  jwt = require('jsonwebtoken'),
  winston = require('winston');
// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
];

var config = require(path.resolve('./config/env/default.js'));
var secret = config.jwt.secret;

// route middleware to verify a token
exports.isAuthenticatedByJWT = function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = fromHeaderOrQuerystring(req);
  console.log( chalk.green( 'user.authentication.server-- verifyJwtToken headers  ' + req.get('Authorization'))  );
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, secret, function(err, decoded) {      
      if (err) {

        console.log(chalk.red( 'user.authentication.server--Failed to authenticate token.......'), err );

        return res.json({ success: false, message: 'Failed to authenticate token.' });

      } else {
        // if everything is good, save to request for use in other routes
        console.log(chalk.green( 'user.authentication.server--authenticate token  ok.' ) );

        console.log(decoded);  

        console.log(new Date(decoded.exp), new Date(decoded.iat), Math.floor(  new Date()/1000) ); 

        req.user = {};
        req.user.username = decoded.name;
        req.user.uid = decoded.uid; 
        req.user.roles = decoded.roles;
        next();

      }
    })

  } else {
    // if there is no token  

    console.log(chalk.red( 'user.authentication.server--no token provided' ) );
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });

  }
}


function fromHeaderOrQuerystring (req) {
  console.log('fromHeaderOrQuerystring',req.get('Authorization'));

  //console.log(  req.get('Authorization').split(' ')[0].toLowerCase() );

  if (req.get('Authorization') && req.get('Authorization').split(' ')[0].toLowerCase() === 'bearer') {
      return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
}

/**
 * Signup
 */
exports.signup = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init user and add missing fields
  var user = new User(req.body);
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;

  console.log('signup ',user);

  // Then save the user
  user.save(function (err) {
    if (err) {
      console.log('sign up  ',err);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          /*
          var tokenPayload = {
              username: user.username,
              loginExpires: user.loginExpires
          };

          // add token and exp date to user object
          user.loginToken = jwt.sign(tokenPayload, secret);
          user.loginExpires = Date.now() + (2 * 60 * 60 * 1000); // 2 hours
          */
          res.status(201).json(user);
        }
      });
    }
  });
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {

  console.log('signin', req.body);
  req.body.usernameOrEmail = req.body.userName || req.body.username || req.body.email;

  passport.authenticate('local-token', function (err, user, info) {
    if (err) {
      console.log('signin err',err,info);
      res.status(422).send(info);
    }else if( !user){
      console.log('.....',info);
      res.status(404).send(info);
    } 
    else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;
      
      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  })(req, res, next);
};


exports.signout = function(req, res) {

    // check header or url parameters or post parameters for token
    var token = fromHeaderOrQuerystring(req);

    winston.info( chalk.green( 'user.authentication.serve-- signout verifyJwtToken headers  ' + req.get('Authorization'))  );

    // decode the token to find out which user it came from
    var decodedPayload = jwt.decode(token, secret);

    winston.info( chalk.green( decodedPayload) , token, secret);

    var username = decodedPayload.name;
    console.log(username);

    // remove login token information from user object
    User.findOne({username: username}, function(err, user) {
        if (err){
            res.status(400).send(err);
        } else {
            user.loginToken = undefined;
            user.loginExpires = undefined;

            // update the user object in the database
            user.save(function(err) {
                if(err){
                    res.status(400).send(err);
                } else {
                    res.send({message: username + ' successfully logged out'});
                }
            });
        }
    });
};


/**
 * Signout
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};
 */


/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {
  return function (req, res, next) {
    // Authenticate
    passport.authenticate(strategy, scope)(req, res, next);
  };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {

    // info.redirect_to contains inteded redirect path
    passport.authenticate(strategy, function (err, user, info) {
      if (err) {
        return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
      }
      if (!user) {
        return res.redirect('/authentication/signin');
      }
      req.login(user, function (err) {
        if (err) {
          return res.redirect('/authentication/signin');
        }

        return res.redirect(info.redirect_to || '/');
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    // Setup info object
    var info = {};

    // Set redirection path on session.
    // Do not redirect to a signin or signup page
    if (noReturnUrls.indexOf(req.query.redirect_to) === -1) {
      info.redirect_to = req.query.redirect_to;
    }

    User.findOne(searchQuery, function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

          User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            user = new User({
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              profileImageURL: providerUserProfile.profileImageURL,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            });

            // Email intentionally added later to allow defaults (sparse settings) to be applid.
            // Handles case where no email is supplied.
            // See comment: https://github.com/meanjs/mean/pull/1495#issuecomment-246090193
            user.email = providerUserProfile.email;

            // And save the user
            user.save(function (err) {
              return done(err, user, info);
            });
          });
        } else {
          return done(err, user, info);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }

      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(function (err) {
        return done(err, user, '/settings/accounts');
      });
    } else {
      return done(new Error('User is already connected using this provider'), user);
    }
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    user.markModified('additionalProvidersData');
  }

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    }
  });
};
