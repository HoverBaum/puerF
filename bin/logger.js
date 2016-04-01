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
        filename: 'puerf-error'
    }
});

//Configure Debug logger.
winston.loggers.add('debug', {
    console: {
        level: 'debug',
        colorize: true
    },
    file: {
        level: 'silly',
        filename: 'puerf-debug'
    }
});

module.exports = function createLogger() {

    //If debugging level is activated.
    debugging = false;


    function log(level, text, more) {
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
        if (more === undefined) {
            more = '';
        }
        getLogger().error(text, more);
    }

    function warn(text, more) {
        if (more === undefined) {
            more = '';
        }
        getLogger().warn(text, more);
    }

    function info(text, more) {
        if (more === undefined) {
            more = '';
        }
        getLogger().info(text, more);
    }

    function debug(text, more) {
        if (more === undefined) {
            more = '';
        }
        getLogger().debug(text, more);
    }

    function silly(text, more) {
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

    return {
        log: log,
        debug: debug,
        info: info,
        error: error,
        warn: warn,
        silly: silly,
        enableDebug: enableDebug
    }

}();
