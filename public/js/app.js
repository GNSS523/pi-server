//MIT License 2015 Leo Villar
//https://github.com/leovillar/ESP8266_MQTT_NodeJs

'use strict';

var app = angular.module('App', ['ngMaterial', 'btford.socket-io'])

var options = {};
options = {};
//options.base_url = "http://192.168.0.4:3000";
//options.soketio = 'http://192.168.0.4:5001';



options.base_url = "http://192.168.1.175:3000";
options.soketio = 'http://192.168.1.175:5001';

app.factory('socket', function(socketFactory) {
    return socketFactory({
      ioSocket: io.connect(options.soketio)
    });

});

app.controller('AppController', ['$http', '$scope', 'socket', function($http, $scope, socket, $mdToast, $animate) {

	$scope.socketStatus = "";

    $scope.topic = 'actuation'

    $scope.ctrls = [
        {
            type: 'switch',
            name: 'abc',
            label: 'Switch 1',
            state: false,
            enabled: true
        }
    ]

    /*
    $http.get(options.base_url + '/switches').success(function(data){
    	$scope.ctrls = [];
        $scope.ctrls = data;
    }).error(function(data, status) {
        console.log(status);
    });
    */

	$scope.$on('socket:error', function (ev, data) {
		$scope.socketStatus = "error";
    });

	socket.on('disconnect', function(){
	    $scope.socketStatus = "disconnect";
	    var ctrls = $scope.ctrls;
        for (var ctrlkey in ctrls) {
            $scope.ctrls[ctrlkey].enabled = true;
        }
	});
	
	socket.on('connect', function(){
	    var ctrls = $scope.ctrls;
        console.log("socket connected ")
        for (var ctrlkey in ctrls) {
            //socket.emit('subscribe', {topic: String(ctrls[ctrlkey].name)});

            socket.emit('subscribe', {topic: $scope.topic});
            $scope.ctrls[ctrlkey].enabled = false;
        }
        $scope.socketStatus = "connected";
	});				

   	socket.on('mqtt', function (msg) {
		console.log(msg.message );

        var msg =  msg.message ; 

		$scope.socketStatus = 'connect';
	    var ctrls = $scope.ctrls;

        for (var ctrlkey in ctrls) {
            if (ctrls[ctrlkey].name == msg.id){
            	$scope.ctrls[ctrlkey].state = eval(msg.state);
            	break;
            }
        }
	});
	
	$scope.onChange = function(device, valor){
		emitSocketPub(device, valor);
  	};


    $scope.enableButton = function( ){
        console.log('enableButton', !$scope.ctrls[0].state   );
        emitSocketPub(  'control' , !$scope.ctrls[0].state   )
    };

	function emitSocketPub (device, valor) {
		//if ($scope.socketStatus == 'connected'){
			socket.emit('publish', {topic: String(device), message: String(valor)});
            console.log('emitSocketPub')
		//}
	};

}]);

