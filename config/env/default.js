'use strict';

module.exports = {
  app: {
    title: 'Liveco ',
    description: 'Liveco application',
    keywords: 'vertical farming, robotics',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  // DOMAIN config should be set to the fully qualified application accessible
  // URL. For example: https://www.myapp.com (including port if required).
  domain: process.env.DOMAIN,
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'MEAN',
  // sessionKey is the cookie session name
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',
  // Lusca config
  csrf: {
    csrf: false,
    csp: false,
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    xssProtection: true
  },
  logo: 'modules/core/client/img/brand/logo.png',
  favicon: 'modules/core/client/img/brand/favicon.ico',
  uploads: {
    profileUpload: {
      dest: './modules/users/client/img/profile/uploads/', // Profile upload destination path
      limits: {
        fileSize: 1 * 1024 * 1024 // Max file size in bytes (1 MB)
      }
    }
  },
  shared: {
    owasp: {
      allowPassphrases: true,
      maxLength: 128,
      minLength: 10,
      minPhraseLength: 20,
      minOptionalTestsToPass: 4
    }
  },
  auth2:{
    accessTokenLifetime: 60 * 60 ,             // 1 hour.
    refreshTokenLifetime: 60 * 60 * 24 * 14,  // 2 weeks.
    authorizationCodeLifetime: 5 * 60 ,        // 5 minutes.
    devicePoolingInterval: 10
  },

  jwt:{
    secret: 'keepitquiet',
    maxAge: 2* 60 * 60 //24 * (60 * 60 )
  },
  server:{
      domain: 'liveco.io',
      ip: '139.59.186.96',
      port: 3000
  },
  winston:{
    error : 'error-file.log',
    info : "info-file.log ",
    debug : 'debug-file.log',
    level : 'info'
  }

};
