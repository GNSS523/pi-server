var _ = require('lodash'),
    uuid = require('node-uuid'),
    util = require('util'),
    winston = require('winston');

function WebServiceError(options) {
    options = options || {};
    var self = this;

    if (_.isString(options)) {
        throw new Error('Please instantiate Errors with the option pattern. e.g. new errors.WebServiceError({message: ...})');
    }

    Error.call(this);
    Error.captureStackTrace(this, WebServiceError);

    /**
     * defaults
     */
    this.statusCode = 500;
    this.errorType = 'InternalServerError';
    this.level = 'normal';
    this.id = uuid.v1();

    /**
     * custom overrides
     */
    this.statusCode = options.statusCode || this.statusCode;
    this.level = options.level || this.level;
    this.context = options.context || this.context;
    this.help = options.help || this.help;
    this.errorType = this.name = options.errorType || this.errorType;
    this.errorDetails = options.errorDetails;
    this.code = options.code || null;

    // @TODO: ?
    this.property = options.property;
    this.value = options.value;

    this.message = options.message;
    this.hideStack = options.hideStack;

    // error to inherit from, override!
    // nested objects are getting copied over in one piece (can be changed, but not needed right now)
    if (options.err) {
        Object.getOwnPropertyNames(options.err).forEach(function (property) {
            if (['errorType', 'name', 'statusCode'].indexOf(property) !== -1) {
                return;
            }

            self[property] = options.err[property] || self[property];
        });
    }

    winston.error('errors.js    ',this.id, this.errorType, this.message, this.hideStack);

}

// jscs:disable
var errors = {

    AuthCodeNotFoundError: function AuthCodeNotFoundError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 404,
            errorType: 'AuthCodeNotFoundError'
        }, options));
    },
    ServiceInternalError: function ServiceInternalError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 500,
            errorType: 'ServiceInternalError'
        }, options));
    },   

    NotFoundError: function NotFoundError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 404,
            errorType: 'NotFoundError'
        }, options));
    },

    // USER
    UserRegisteredError: function UserRegisteredError(options){
        WebServiceError.call(this, _.merge({
            statusCode: 409,
            errorType: 'UserRegisteredError'
        }, options));
    },

    EmailRegisteredError: function EmailRegisteredError(options){
        WebServiceError.call(this, _.merge({
            statusCode: 409,
            errorType: 'EmailRegisteredError'
        }, options));
    },    
    UserNotFoundError: function UserNotFoundError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 404,
            errorType: 'UserNotFoundError'
        }, options));
    },


    // DEVICE
    DeviceNotFoundError: function DeviceNotFoundError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 404,
            errorType: 'DeviceNotFoundError'
        }, options));
    },
    DeviceDataNotFoundError: function DeviceDataNotFoundError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 404,
            errorType: 'DeviceDataNotFoundError'
        }, options));
    },   
    DeviceNotOnlineError: function DeviceNotOnlineError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 400,
            errorType: 'DeviceNotOnlineError'
        }, options));
    },
    DeviceInvalidModeError: function DeviceInvalidModeError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 400,
            errorType: 'DeviceInvalidModeError'
        }, options));
    },





    // SERVICE
    ServiceNotAvailableError: function ServiceNotAvailableError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 503,
            errorType: 'ServiceNotAvailableError'
        }, options));
    },  

    ServiceInternalError: function ServiceInternalError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 500,
            errorType: 'ServiceInternalError'
        }, options));
    },  

    TooManyRequestsError: function TooManyRequestsError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 429,
            errorType: 'TooManyRequestsError'
        }, options));
    },     
    BadRequestError: function BadRequestError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 400,
            errorType: 'BadRequestError'
        }, options));
    },
    MaintenanceError: function MaintenanceError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 503,
            errorType: 'MaintenanceError'
        }, options));
    },


    // DATABASE
    DatabaseVersionError: function DatabaseVersionError(options) {
        WebServiceError.call(this, _.merge({
            hideStack: true,
            statusCode: 500,
            errorType: 'DatabaseVersionError'
        }, options));
    },
    DatabaseNotPopulatedError: function DatabaseNotPopulatedError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 500,
            errorType: 'DatabaseNotPopulatedError'
        }, options));
    },
    DatabaseNotSeededError: function DatabaseNotSeededError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 500,
            errorType: 'DatabaseNotSeededError'
        }, options));
    },


    InValidRequestError: function InValidRequestError(options){
        WebServiceError.call(this, _.merge({
            statusCode: 400,
            errorType: 'InValidRequestError'
        }, options));
    },


    // AUTH
    UnauthorizedError: function UnauthorizedError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 401,
            errorType: 'UnauthorizedError'
        }, options));
    },
    AuthClientNotFoundError: function AuthClientNotFoundError(options){
        WebServiceError.call(this, _.merge({
            statusCode: 404,
            errorType: 'AuthClientNotFoundError'
        }, options));
    },
    AuthCodeExpiredError: function AuthCodeExpiredError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 400,
            errorType: 'AuthCodeExpiredError'
        }, options));
    },
    AuthCodeNotFoundError: function AuthCodeNotFoundError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 404,
            errorType: 'AuthCodeNotFoundError'
        }, options));
    },    
    AuthForbiddenError: function AccessDeniedError(options) {
        // @see https://tools.ietf.org/html/rfc6749#section-4.1.2.1  
        WebServiceError.call(this, _.merge({
            statusCode: 403,
            errorType: 'AuthForbiddenError',
            errorDetails:'The resource owner or authorization server denied the request'
        }, options));
    },
    AccessCodeNotFoundError: function AccessCodeNotFoundError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 404,
            errorType: 'AccessCodeNotFoundError'
        }, options));
    },    
    AccessCodeExpiredError: function AccessCodeExpiredError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 400,
            errorType: 'AccessCodeExpiredError'
        }, options));
    },


    // PERMISSION
    NoPermissionError: function NoPermissionError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 403,
            errorType: 'NoPermissionError'
        }, options));
    },
    NotWritableError: function NotWritableError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 400,
            errorType: 'NotWritableError'
        }, options));
    },
    ReadOnlyFieldError: function ReadOnlyFieldError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 400,
            errorType: 'ReadOnlyFieldError'
        }, options));
    },




    // VALIDATION
    ValidationError: function ValidationError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 422,
            errorType: 'ValidationError'
        }, options));
    },

    IdMissingValidationError: function IdMissingValidationError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 400,
            errorType: 'IdMissingValidationError'
        }, options));
    },

    PayloadMissingValidationError: function PayloadMissingValidationError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 400,
            errorType: 'PayloadMissingValidationError'
        }, options));
    },

    PayloadIncompleteValidationError: function PayloadIncompleteValidationError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 400,
            errorType: 'PayloadIncompleteValidationError'
        }, options));
    },

    TimeFormatValidationError: function TimeFormatValidationError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 400,
            errorType: 'TimeFormatValidationError'
        }, options));
    },

    UnsupportedMediaTypeError: function UnsupportedMediaTypeError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 415,
            errorType: 'UnsupportedMediaTypeError'
        }, options));
    },



    TokenRevocationError: function TokenRevocationError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 503,
            errorType: 'TokenRevocationError'
        }, options));
    },




    // MQTT
    NoPublishPermissionError: function NoPublishPermissionError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 403,
            errorType: 'NoPublishPermissionError'
        }, options));
    },
    NoSubscribePermissionError: function NoSubscribePermissionError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 403,
            errorType: 'NoSubscribePermissionError'
        }, options));
    },
    SourceDeviceDisconnectedError: function SourceDeviceDisconnectedError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 403,
            errorType: 'SourceDeviceDisconnectedError'
        }, options));
    },
    RateLimitExceededError: function RateLimitExceededError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 429,
            errorType: 'RateLimitExceededError'
        }, options));
    },        




   // OTA
    OTAInProgressError: function OTAInProgressError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 202,
            errorType: 'OTAInProgressError'
        }, options));
    },
    OTAFirmwareUpToDateError: function OTAInProgressError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 304,
            errorType: 'OTAInProgressError'
        }, options));
    },
    OTAError: function OTAError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 500,
            errorType: 'OTAError'
        }, options));
    },
    OTANotEabledError: function OTANotEabledError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 403,
            errorType: 'OTANotEabledError'
        }, options));
    },
    OTAFlashError: function OTAFlashError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 500,
            errorType: 'OTAFlashError'
        }, options));
    },
    OTABadFirmwareError: function OTAFlashError(options) {
        WebServiceError.call(this, _.merge({
            statusCode: 400,
            errorType: 'OTAFlashError'
        }, options));
    }              



};

util.inherits(WebServiceError, Error);
_.each(errors, function (error) {
    util.inherits(error, WebServiceError);
});

module.exports = errors;
module.exports.WebServiceError = WebServiceError;


