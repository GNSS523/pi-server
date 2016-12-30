'use strict';

var adminPolicy = require('../policies/device.server.policy'),
    path = require('path'),
    chalk = require('chalk'),
    config = require(path.resolve('./config/env/default.js'));

module.exports = function (app) {


};


var Dashboard = require('../controllers/dashboard');
var dashboard = new Dashboard(5001);

var MQTTSocketioService = require('../controllers/MQTTSocketioService');

var services = {};
    services['led'] = './devices/lights';
    services['camera'] = './devices/camera';

var mqttDataService = new MQTTSocketioService('device-socketio-service'+Math.random(1000),
                      dashboard,
                      services
                      );









