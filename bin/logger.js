/**

    Abstraction for the used logger.

    Provides:
        .error
        .warn
        .info
        .debug
        .log        Defaults to 'info'


    Currently abstracts winston
    https://github.com/winstonjs/winston

*/

//Dependencies
var winston = require('winston');
var path = require('path');

module.exports = function createLogger() {

    var loggingLevels = {
        levels: {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3
        }
    };

    //Create a custom logger.
    var logger = new(winston.Logger)({
        levels: loggingLevels.levels,
        colorize: true,
        transports: [

            //Extra file for errors.
            new(winston.transports.File)({
                name: 'file-error',
                filename: 'puerf-error.log',
                level: 'error'
            }),

            //Log everyhting before info to console.
            new(winston.transports.Console)({
                level: 'info'
            })
        ]
    });

    //Make commandline output pretty.
    logger.cli();

    /**
     *   .log requires some more abstracion.
     */
    function log(level, text) {
        if (text === undefined) {
            text = level;
            level = 'info';
        }
        logger.log(level, text);
    }

    return {
        log: log,
        debug: logger.debug,
        info: logger.info,
        error: logger.error,
        warn: logger.warn
    }

}();
