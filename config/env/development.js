'use strict';

var defaultEnvConfig = require('./default');

module.exports = {

  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || '127.0.0.1:27017') + '/mean-dev' ,
    options: {
      user: '',
      pass: '',
      server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 }} ,
      replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 }} 
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
   // 
  mqtt:{
    uri: process.env.MQTT_URL || process.env.MQTT_URI || 'mqtt://' + (process.env.DB_1_PORT_1883_TCP_ADDR || '127.0.0.1:1883') ,
    options: {
      user: '',
      pass: ''
    }
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    fileLogger: {
      directoryPath: process.cwd(),
      fileName: 'app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  app: {
    title: defaultEnvConfig.app.title + ' - Development Environment'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: '/api/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/github/callback'
  },
  paypal: {
    clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
    clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
    callbackURL: '/api/auth/paypal/callback',
    sandbox: true
  },
  mailer: {
    from: process.env.MAILER_FROM || 'abc@abc.io',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'smtp.zoho.com',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'hello@abc.io',
        pass: process.env.MAILER_PASSWORD || 'abc_hello'
      }
    }
  },
  livereload: true,
  seedDB: {
    seed: true, //process.env.MONGO_SEED === 'true',
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS !== 'false',
      seedUser: {
        username: process.env.MONGO_SEED_USER_USERNAME || 'abc',
        provider: 'local',
        email: process.env.MONGO_SEED_USER_EMAIL || 'abc@gmail.com',
        firstName: 'abc',
        lastName: 'abc',
        displayName: 'abc',
        roles: ['user']
      },
      seedAdmin: {
        username: process.env.MONGO_SEED_ADMIN_USERNAME || 'admin',
        provider: 'local',
        email: process.env.MONGO_SEED_ADMIN_EMAIL || 'admin@xxxx.io',
        firstName: 'sizhe',
        lastName: 'xi',
        displayName: 'admin_sizhe_xi',
        roles: ['user', 'admin']
      }
    }
  }
};
