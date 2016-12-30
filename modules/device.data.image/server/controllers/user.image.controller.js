'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    path = require('path'),
    config = require(path.resolve('./config/env/default.js')),
    errors = require(path.resolve('./config/lib/errors.js')),
    is = require(path.resolve('./config/lib/middleware/validation/is.js')),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    hat = require('hat'),
    multer  = require('multer');


/*
  POST 
  http://localhost:3000/v1/devices/device_123/images

  Content-Type: application/json
*/


exports.saveImage = function(req, res, next){

    var device_id = req.params.device_id ;

    if(!device_id){
        throw new errors.InValidRequestError({'errorDetails':'Missing parameter: device_id'});       
    }
    if(!is.vschar(device_id)) {
        throw new errors.InvalidRequestError({'errorDetails':'Invalid parameter: device_id'});
    }

    // https://github.com/expressjs/multer/issues/196
    // https://github.com/expressjs/multer/issues/170

    var upload = multer({ storage: multer.diskStorage({
        destination: (req, file, cb) => {
          var date = new Date();
          var day = date.getFullYear()+"_"+date.getMonth()+"_"+date.getDate();
          console.log(day);
          require('fs').mkdir('uploads/'+day, err => {
            cb(null, 'uploads/'+day);
          });
        },
        filename: (req, file, cb) => {
          console.log(file.originalname);
          var name = file.originalname.split('/').pop().trim().split('.')[0];
          var date = new Date();
          var now = date.getHours()+"_"+date.getMinutes();          
          cb(null, device_id+"_"+now+".jpg");
        }
      })
    }).single('file');

    uploadImage()
      .then(function () {
        console.log('uploadImage    ...... ');
        res.json('user');
      })
      .catch(function (err) {
        res.status(400).send(err);
    });

    function uploadImage () {
      return new Promise(function (resolve, reject) {
        upload(req, res, function (uploadError) {
          if (uploadError) {
            console.log('reject image upload');
            reject(errorHandler.getErrorMessage(uploadError));
          } else {
            console.log('accept upload image');
            resolve();
          }
        });
      });
    }

}


/*
  GET 
  http://localhost:3000/v1/devices/:device_id?date=
  
  http://localhost:3000/v1/devices/images/device_123?date=2016.2.14
*/
exports.getImages = function(req, res, next){

    var device_id = req.params.device_id, 
        date = req.query.date;

    if(!device_id){
        throw new errors.InValidRequestError({'errorDetails':'Missing parameter: device_id'});       
    }
    if(!is.vschar(device_id)) {
        throw new errors.InvalidRequestError({'errorDetails':'Invalid parameter: device_id'});
    }

    if(!date){
        throw new errors.InValidRequestError({'errorDetails':'Missing query parameter: date'});       
    }    


    res.status(200).json({'message':"success"});

}