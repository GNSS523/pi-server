'use strict';

var adminPolicy = require('../policies/device.image.policy'),
    deviceImageController  = require('../controllers/user.image.controller');

//var auth = require('../../../users/server/controllers/users/users.authentication.server.controller');


const mqtt = require('mqtt');
var config = require('../../../../config/config.js'),
    host = config.mqtt.uri;

module.exports = function (app) {
 
    //# post data
    app.route('/device/:device_id/images')//.all(auth.isAuthenticatedByJWT)
                                          .post(deviceImageController.saveImage );
    
    app.route('/device/:device_id/images/:date')//.all(auth.isAuthenticatedByJWT)
                                                .get(deviceImageController.getImages  );

};