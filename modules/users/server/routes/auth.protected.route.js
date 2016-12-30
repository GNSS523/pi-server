'use strict';

module.exports = function (app) {
  // User Routes
  var auth = require('../controllers/users/users.authentication.server.controller');

  // device.acutation device.connection device.management
  app.use('/v1/devices/:device_id', auth.isAuthenticatedByJWT );
  
  // device.auth
  app.use('/v1/oauth/client', auth.isAuthenticatedByJWT);

  // device.auth
  app.use('/v1/oauth/device/token', auth.isAuthenticatedByJWT);
  app.use('/v1/oauth/device/authenticate', auth.isAuthenticatedByJWT);  
  

};