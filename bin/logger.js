/**

    Abstraction for the used logger.

    Provides:
        .error
        .warn
        .info
        .debug
        .silly
        .log        Defaults to 'info'


    Currently abstracts winston
    https://github.com/winstonjs/winston

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

module.exports = function createLogger() {

    //If debugging level is activated.
    var debugging = false;

    //Wether logging is currently disabled.
    var var disabled = false;


    function log(level, text, more) {
        if(disabled) {
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

    function error(text, more) {
        if(disabled) {
            return;
        }
        if (more === undefined) {
            more = '';
        }
        getLogger().error(text, more);
    }

    function warn(text, more) {
        if(disabled) {
            return;
        }
        if (more === undefined) {
            more = '';
        }
        getLogger().warn(text, more);
    }

    function info(text, more) {
        if(disabled) {
            return;
        }
        if (more === undefined) {
            more = '';
        }
        getLogger().info(text, more);
    }

    function debug(text, more) {
        if(disabled) {
            return;
        }
        if (more === undefined) {
            more = '';
        }
        getLogger().debug(text, more);
    }

    function silly(text, more) {
        if(disabled) {
            return;
        }
        if (more === undefined) {
            more = '';
        }
        getLogger().silly(text, more);
    }

    /**
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
    function enableDebug() {
        debugging = true;
        info('Enabling debugging output');
    }

    /**
     *   Will disable any logging.
     *   Meant for testing where we don't want logs.
     */
    function disableLogging() {
        disabled = true;
    }

    /**
     *   Will enable loggong, as it is by default.
     */
    function enableLogging() {
        disabled = false.
    }

    return {
        log: log,
        debug: debug,
        info: info,
        error: error,
        warn: warn,
        silly: silly,
        enableDebug: enableDebug,
        disable: disableLogging,
        enable: enableLogging
    }

}();
