/**

    puerF, a simple tool to run a live reloading server
    with mocked routes and FreeMarker templates.

    @module puer-freemarker

*/
//IDEA hook to Ctrl+C to delte files and do some clean up.

//Dependencies.
var fs = require('fs');

//Submodules
var processor = require('./routePreProcessor');
var startPuer = require('./puerServer');
var logger = require('./logger');

//The server we are running, so that it can be closed later.
var server = null;

//Keep track of all watcher we started so we can close them later.
var watchers = [];

/**
 *  Runs the initializer.
 *  Will output basic files to the current working directory.
 *
 *  @param options {object} Options for the initializer.

    onlyConfig      If true will only generate the config file.
 *  @see initializer
 *  @param callback {function} Function to call once done.
 */
exports.init = function runInitializer(options, callback) {
    var initializer = require('./initializer');
    initializer.init(options, callback);
}

/**
 *  Starts the core application.
 *
 *  @param options {object} An object containing options.

 | Options   | Description                                             | Default                                     |
 |:----------|---------------------------------------------------------|---------------------------------------------|
 | routes    | An array of paths to all files containing mocked routes | ['mock/ftlRoutes.js', 'mock/routes.js']     |
 | config    | Where to find the config file                           | './puerFConfig.js'                          |
 | templates | Path to base for templates                              | './templates'                               |
 | root      | Root folder for static files                            | './'                                        |
 | port      | The port to use                                         | 8080                                        |
 | watch     | Filetypes to watch, default:                            | 'js&#124;css&#124;html&#124;xhtml&#124;ftl' |
 | exclude   | Files to exclude from watch                             | /node_modules/                              |
 | localhost | If true will use localhost instead of 127.0.0.1         | false                                       |
 | browser   | If browser should be opened                             | true                                        |
 | debug     | Enable debug output                                     | false                                       |

 *  @param callback {function} Function to call once started.
 */
exports.start = function startPuerF(options, callback) {

    //Check if we should enable debug.
    if (options.debug) {
        logger.enableDebug();
    }

    if (options.config) {
        loadConfiguration(callback);
    } else {
        runPuerF(options, callback);
    }
}

/**
 *   Programatically closes puerF.
 *
 *   @param callback {function} Function to call once done.
 */
//FIXME this is not working, see https://github.com/leeluolee/puer/issues/30
exports.close = function closePuerF(callback) {
    logger.debug('Stopping file watchers');
    watchers.forEach(watcher => {
        watcher.close();
    });
    logger.debug('Stopping server');
    server.close(function() {
        callback();
    });
}

/**
 *   Loads the config file and starts puerF.
 *  @private
 */
function loadConfiguration(callback) {
    logger.info('Loading config file');
    var path = require('path');
    var configPath = path.join(process.cwd(), 'puerFConfig.js');
    var options = require(configPath);
    runPuerF(options, callback);
}

/**
 *   Actually start the core application.
 *  @private
 */
function runPuerF(cli, callback) {

    //The files containing information about mocked routes.
    var routeFiles = (cli.routes.length >= 1) ? cli.routes : ['mock/ftlRoutes.js', 'mock/routes.js'];

    //Path to combined file.
    var combinedFile = 'mock/allPuerFRoutes.js';

    //Root directory for templates.
    var templatesPath = cli.templates || 'templates';

    //Watch route files for changes and act upon them.
    routeFiles.forEach(file => {
        if (fs.existsSync(file)) {
            var watcher = fs.watch(file, (event, filename) => {
                onRoutesChange();
            });
            watchers.push(watcher);
        }
    });

    /**
     *   A function to be called when routes change.
     *   Will parse them again and tell the server to update routes.
     *  @private
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
     *   Process all route files with given config.
     *  @private
     */
    function processRouteFiles(callback) {
        processor.process(routeFiles, combinedFile, callback);
    }

    /*
     *   This is where the script starts.
     */
    logger.info('Starting up...');

    //Initially parse the routes files and start the puer server.
    processRouteFiles(function() {
        logger.info('Initially compiled routes, starting server...')
        var noBrowser = (cli.browser === undefined) ? true : cli.browser;
        server = startPuer(combinedFile, {
            port: cli.port,
            dir: cli.root,
            ignored: cli.exclude,
            watch: cli.watch,
            localhost: cli.localhost,
            browser: noBrowser,
            templatesPath: templatesPath
        }, callback);
    });
};
