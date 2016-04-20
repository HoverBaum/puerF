/**

    Abstraction for the used logger.

    Currently abstracts winston
    https://github.com/winstonjs/winston

    @module puer-freemarker/logger
    @version 1.0.0
*/

//Dependencies
var winston = require('winston');
var path = require('path');

//Configure Standard logger.
winston.loggers.add('standard', {
    console: {
        level: 'info',
        colorize: true
    },
    file: {
        level: 'error',
        filename: 'puerf-error.log'
    }
});

//Configure Debug logger.
winston.loggers.add('debug', {
    transports: [
        new(winston.transports.Console)({
            level: 'debug',
            colorize: true
        }),
        new(winston.transports.File)({
            name: 'debug-file',
            filename: 'puerf-debug.log',
            level: 'silly'
        }),
        new(winston.transports.File)({
            name: 'error-file',
            filename: 'puerf-error.log',
            level: 'error'
        })
    ]
});


//If debugging level is activated.
var debugging = false;

//Wether logging is currently disabled.
var disabled = false;

/**
 *   Logs a message, this is an alias for ".info".
 *
 *   @param level {string} The level at which to log.
 *   @param text {string} The message to log.
 *   @param more {object} Data to log along with the message.
 */
exports.log = function log(level, text, more) {
    if (disabled) {
        return;
    }
    if (text === undefined) {
        text = level;
        level = 'info';
    }
    if (more === undefined) {
        more = '';
    }
    getLogger().log(level, text, more);
}

/**
 *   Logs a message at the error level.
 *
 *   @param text {string} The message to log.
 *   @param more {object} Data to log along with the message.
 */
exports.error = function error(text, more) {
    if (disabled) {
        return;
    }
    if (more === undefined) {
        more = '';
    }
    getLogger().error(text, more);
}

/**
 *   Logs a message at the warn level.
 *
 *   @param text {string} The message to log.
 *   @param more {object} Data to log along with the message.
 */
exports.warn = function warn(text, more) {
    if (disabled) {
        return;
    }
    if (more === undefined) {
        more = '';
    }
    getLogger().warn(text, more);
}

/**
 *   Logs a message at the info level.
 *
 *   @param text {string} The message to log.
 *   @param more {object} Data to log along with the message.
 */
exports.info = function info(text, more) {
    if (disabled) {
        return;
    }
    if (more === undefined) {
        more = '';
    }
    getLogger().info(text, more);
}

/**
 *   Logs a message at the debug level.
 *
 *   @param text {string} The message to log.
 *   @param more {object} Data to log along with the message.
 */
exports.debug = function debug(text, more) {
    if (disabled) {
        return;
    }
    if (more === undefined) {
        more = '';
    }
    getLogger().debug(text, more);
}

/**
 *   Logs a message at the silly level.
 *
 *   @param text {string} The message to log.
 *   @param more {object} Data to log along with the message.
 */
exports.silly = function silly(text, more) {
    if (disabled) {
        return;
    }
    if (more === undefined) {
        more = '';
    }
    getLogger().silly(text, more);
}

/*
 *   Returns the logger that should currently be used.
 */
function getLogger() {
    var loggerName = (debugging) ? 'debug' : 'standard';
    var logger = winston.loggers.get(loggerName);
    logger.cli();
    return logger;
}

/**
 *   Sets up a logger for debugging.
 */
exports.enableDebug = function enableDebug() {
    debugging = true;
    info('Enabling debugging output');
}

/**
 *   Will disable any logging.
 *   Meant for testing where we don't want logs.
 */
exports.disable = function disableLogging() {
    disabled = true;
}

/**
 *   Will enable loggong, as it is by default.
 */
exports.enable = function enableLogging() {
    disabled = false;
}
