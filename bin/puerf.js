/**

    puerF, a cimple tool to run a live reloading server
    with mocked routes and FreeMarker tmeplates.

*/

//Dependencies.
var fs = require('fs');

//Submodules
var processor = require('./routePreProcessor');
var startPuer = require('./puerServer');
var logger = require('./logger');

//The puer server.
var server = null;
var cli = null;

module.exports = function(options, command) {
    cli = options

    //Check if we should enable debug.
    if (cli.debug) {
        logger.enableDebug();
    }

    cli = options;
    if(command === 'init') {
        var initializer = require('./initializer');
        initializer.init(options);
    } else {
        startPuerf()
    }
}





//Start puerf if we are not running the init script.
//if(cli.args.every(elm => elm._name !== 'init')) {
//    startPuerf();
//}

function startPuerf() {

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
        fs.watch(ftlRoutesFile, (event, filename) => {
            onRoutesChange();
        });
    }
    if (fs.existsSync(routesFile)) {
        fs.watch(routesFile, (event, filename) => {
            onRoutesChange();
        });
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
        processor.process({
            routesFile,
            ftlRoutesFile,
            combinedFile
        }, callback);
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
        });
    });
};
