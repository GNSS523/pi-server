'use strict';

var mqtt = require('mqtt'),
    chalk = require('chalk'),
    path = require('path'),
    winston = require('winston');

 var config = require(path.resolve('./config/env/default.js'));


var subscripeTopics = [];
var mqtt_client;
var regex = "device/(.*)/(.*)/get/(.*)";
var socketio;
var services = {};

function MQTTSocketioService(clientId, mysocketio, service_list) {


    var mqttOptions = {  
        clientId: 'device-socketio-service'+Math.random(1000), 
        clean: false, 
        keepalive: 10,
        will: {
          topic: 'dead',
          payload: 'mypayload',
          qos: 2,
          retain: true
        }  
    };

    mqttOptions.clientId = clientId;
    services = service_list;
    socketio = mysocketio;

    if(socketio == null){

      console.log(chalk.red('d '));
    }

    this.initSubService();
    this.startMqttService(mqttOptions);

}

MQTTSocketioService.prototype.initSubService = function (){

     for (var i in services){
        var servicePath = services[i];
        winston.debug('---------------------',i , servicePath);
        var service = require( servicePath );
        //service.test();
        winston.debug( '-------------------' ,service.getSubscripeTopics().length   );

        for(var i = 0; i<service.getSubscripeTopics().length;i++){
          winston.debug( chalk.green( service.getSubscripeTopics()[i] ) );
          subscripeTopics.push( service.getSubscripeTopics()[i] );
        }
     }

     console.log('-----------------------',subscripeTopics.length);
}

MQTTSocketioService.prototype.startMqttService = function(mqttOptions){

    mqtt_client = mqtt.connect( config.mqtt.uri , mqttOptions ); 
    mqtt_client.on('connect', onConnectionSuccess);
    mqtt_client.on('error',onConnectionError);
    mqtt_client.on('message',onMessageReceived);

}


  function onConnectionSuccess(){


    winston.info(chalk.green( 'device.socketio.routes.js  connected success  '));
    winston.debug('-----------------------',subscripeTopics.length);

    subscripeTopics.forEach(function(topic){
        winston.debug('  ----------  connection   ',topic);        
        mqtt_client.subscribe(topic , { qos: 2}, function(err, granted) {
            if (err) {
                console.log(new Date().toTimeString() + ' [MQTT] ERROR: ' + err);
            } else {
                console.log(new Date().toTimeString() + ' [MQTT] Subscribed to topic ' + granted[0].topic + ' with QoS ' + granted[0].qos);
            }
        });

    })


  }

  function onConnectionError(){
      winston.info(chalk.red( 'users.socketio MQTTSocketioService.js  connected error'));
      var msg = 'mqtt server not connected';
      socketio.publishErrorMessage(msg);
  }

  function onMessageReceived(topic, message){

      var parts = topic.match(regex);
      if(parts == null) return;

      var type = parts[1];
      var device_id = parts[2];
      var property = parts[3];

      // check database to see if the device is authenticated or not
      //console.log(message);
      var msg = JSON.parse(message);
      msg.device_id = device_id;
      winston.debug(chalk.blue( 'users.socketio MQTTSocketioService.js  onMessageReceived '), type, device_id, property, msg);

      //console.log(services[type]);

      var device_service = require(services[type])

      // check where the device is belonging to group

      var group = 'farm_123';


      switch(property) {
        case "sensing":

          device_service.notifiyUpdateOnData(socketio, group , msg);

        break;

        case "status":

          device_service.notifyUpdateOnStatus(socketio, group , msg);

        break;
      }

}


module.exports = MQTTSocketioService;