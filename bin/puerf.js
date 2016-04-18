/**

    puerF, a cimple tool to run a live reloading server
    with mocked routes and FreeMarker tmeplates.

    Please see the cli for available options.

*/

//Dependencies.
var fs = require('fs');

//Submodules
var processor = require('./routePreProcessor');
var startPuer = require('./puerServer');
var logger = require('./logger');

//The server we are running, so that it can be closed later.
var server = null;

//Keep track of all watcher we started so we can close them later.
var watcher = [];

/**
 *   Just runs the initializer.
 */
function runInitializer(options, callback) {
    var initializer = require('./initializer');
    initializer.init(options, callback);
}

/**
 *   Starts teh core application.
 */
function startPuerF(options, callback) {

    //Check if we should enable debug.
    if (options.debug) {
        logger.enableDebug();
    }

    runPuerF(options, callback)
}

/**
*   Programatically closes puerF.
    //FIXME this is not working, see https://github.com/leeluolee/puer/issues/30
*/
function closePuerF(callback) {
    logger.debug('Stopping file watchers');
    watcher.forEach(watcher => {
        watcher.close();
    });
    logger.debug('Stopping server');
    server.close(function() {
        callback();
    });
}

/**
 *   Actually start the core application.
 */
function runPuerF(cli, callback) {

    //Path to ftlRoutes file.
    var ftlRoutesFile = cli.freemarker || 'mock/ftlRoutes.js';

    //Path to routes file.
    var routesFile = cli.mock || 'mock/routes.js';

    //Path to combined file.
    var combinedFile = cli.combined || 'mock/allRoutes.js';

    //Root directory for templates.
    var templatesPath = cli.templates || 'templates';

    //Watch route files for changes and act upon them.
    if (fs.existsSync(ftlRoutesFile)) {
        var ftlWatcher = fs.watch(ftlRoutesFile, (event, filename) => {
            onRoutesChange();
        });
        watcher.push(ftlWatcher);
    }
    if (fs.existsSync(routesFile)) {
        var routesWatcher = fs.watch(routesFile, (event, filename) => {
            onRoutesChange();
        });
        watcher.push(routesWatcher);
    }


    /**
     *   A function to be called when routes change.
     *   Will parse them again and tell the server to update routes.
     */
    function onRoutesChange() {
        processRouteFiles(function() {
            logger.info('Refreshing mocked routes')
            if (server !== null) {
                server.updateRoutes();
            }
        });
    }

    /**
     *   Process both route files with given config.
     */
    function processRouteFiles(callback) {
        processor.process([
            routesFile,
            ftlRoutesFile
        ], combinedFile, callback);
    }

    /**
     *   This is where the script starts.
     */
    logger.info('Starting up...');

    //Initially parse the routes files and start the puer server.
    processRouteFiles(function() {
        logger.info('Initially compiled routes, starting server...')
        server = startPuer(combinedFile, {
            port: cli.port,
            dir: cli.root,
            ignored: cli.exclude,
            watch: cli.watch,
            localhost: cli.localhost,
            browser: cli.browser,
            templatesPath: templatesPath
        }, callback);
    });
};

module.exports = {
    start: startPuerF,
    close: closePuerF,
    init: runInitializer
}
