//var NamespaceSocket = require('../socket/namespaceSocket');
"use strict";

var chalk = require('chalk'),
    uuid = require('node-uuid'),
    winston = require('winston');

console.log('init camera.js  ....');

var camera = {

}

/*
var _socketio;

lights = function(socketio){

	_socketio = socketio;
} 
*/

camera.getSubscripeTopics = function(){
	
	console.log('getSubscripeTopics');

	return [
            "device/camera/+/get/status"
	];

}


camera.notifiyUpdateOnData = function(_socketio, group, message){

     _socketio.publishDataMessage(group,message);
}

camera.notifyUpdateOnStatus = function(_socketio, group, message){

     _socketio.publishStatusMessage(group,message);

}


module.exports = camera;