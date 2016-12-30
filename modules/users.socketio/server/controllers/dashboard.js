'use strict';

var socketio = require('socket.io'),
	chalk = require('chalk'),
	path = require('path'),
	socketioJwt = require('socketio-jwt'),
    winston = require('winston');  // https://github.com/auth0/socketio-jwt

var config = require(path.resolve('./config/env/default.js'));


module.exports = class Dashboard {

	constructor(port) {
		this.io = socketio().listen(port);
		this.initAuthentication();
		this.initSocket();

		this.simulate(this.io);
	}

	initAuthentication(){
		this.io.use(socketioJwt.authorize({
			secret: config.jwt.secret,
  			handshake: true,
  			callback: 15000 
		}));		
	}

    initSocket() {
		this.io.on('connection', (socket) => {

			socket.emit('message', { message: "Welcome. Successfully connected to server." });
			winston.info(chalk.green("users.socketio dashboard.js    New client connected. Current connected: ") + socket.decoded_token.name );

			socket.on('line', function (data) {
			    var sockets = io.sockets.server.sockets.sockets;
			    for (var index in sockets) {
			      if (socket != sockets[index]) {
			        sockets[index].emit('line', { line: data.line });
			      }
			    }
			});

		    socket.on('subscribe', function(room) { 
		        winston.info(chalk.green( 'users.socketio dashboard.js joining room'), room);
		        socket.join(room); 
		    })

		    socket.on('unsubscribe', function(room) {  
		        winston.info(chalk.green('users.socketio dashboard.js leaving room'), room);
		        socket.leave(room); 
		    })			

			socket.on('disconnect', function(reason){
			    console.log(chalk.red('users disconnected'),reason);
			});
		});
   }

	publishErrorMessage (  msg) {

		this.io.sockets.emit('error',{topic:'error',message: msg}); 

	}

	publishDataMessage ( group, msg) {

     //_socketio.in(namespace_id).emit('mqtt',{'topic': "data", "message": { "id":device_id, "msg":message }  });
     
		var device_id = msg.device_id
		delete msg['device_id']; 

		/*	     //time = msg.time;	*/

		winston.debug(chalk.green( 'users.socketio dashboard.js  publishDataMessage'), group,{ "id":device_id, "data": msg });

		this.io.sockets.in(group)
		          .emit('mqtt',{'topic': "data", "message": { "id":device_id, "data": msg , time: new Date() }  }); 

	}

	publishStatusMessage(group, msg){
     //_socketio.in(namespace_id).emit('mqtt',{'topic': "status", "message": { "id":device_id, "msg":message }  });

		var device_id = msg.device_id;
		delete msg['device_id']; 

		this.io.sockets.in(group)
		          .emit('mqtt',{'topic': "status", "message": { "id":device_id, "data": msg, time: new Date() }  }); 
	}

	simulate(io){

		var state = 'off'
		var device_id = 'abc'

		setInterval(() => {  
			//console.log('close door')
			if(state == 'off'){
			  state = 'on'
			  io.sockets.in("sensing").emit('mqtt',{'topic': "actuation", "message": { 'id':device_id, "state": "true"  }  }); 
			}
			else{
			  state = 'off'
			  io.sockets.in('sensing').emit('mqtt',{'topic': "actuation", "message": { "id":device_id, "state": "false" }  }); 
			}  
		}, 5000)
	}

}