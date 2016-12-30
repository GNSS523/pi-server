//var NamespaceSocket = require('../socket/namespaceSocket');
"use strict";

var chalk = require('chalk'),
    uuid = require('node-uuid');

console.log('init lights3.js  ....');

var lights = {

}

/*
var _socketio;

lights = function(socketio){

	_socketio = socketio;
} 
*/

lights.getSubscripeTopics = function(){
	
	console.log('getSubscripeTopics');

	return [
            "device/led/+/get/ack",
            "device/led/+/get/sensing",
            "device/led/+/get/status"
	];

}


lights.notifiyUpdateOnData = function(_socketio, group, message){

     _socketio.publishDataMessage(group,message);
}

lights.notifyUpdateOnStatus = function(_socketio, group, message){

     _socketio.publishStatusMessage(group,message);

}


module.exports = lights;


/*

const events = {
	answer: 'answer',
	reset: 'reset',
	playerJoined: 'player:join',
	players: 'players',
	question: 'question'
};

module.exports =  class Led extends NamespaceSocket {

	constructor(io) {
		super(io, 'LED');
	}

	playerJoined(player) {
		this.emit(events.playerJoined, player.infosForAdmin);
	}

	updatePlayers(players) {
		this.emit(events.players, Object.keys(players).map(sessId => players[sessId].infosForAdmin));
	}

	reset() {
		this.emit(events.reset);
	}

	currentQuestion(question) {
		this.emit(events.question, question.adminJson);
	}

	answerStatistics(statistics) {
		this.emit(events.answer, statistics);
	}


	notifiyUpdateOnData(){

	}

	notifyUpdateOnStatus(){

	}

}
*/
