/**
 *
 *   puerF, a simple tool to run a live reloading server
 *   with mocked routes and FreeMarker templates.
 *
 *   @module puer-freemarker
 *
 */

//Dependencies.
var fs = require('fs');
var path = require('path');

//Submodules
var processor = require('./routePreProcessor');
var startPuer = require('./puerServer');
var logger = require('./logger');

var cleanTemplates = require('./templateCleaner');

//The server we are running, so that it can be closed later.
var server = null;

//Keep track of all watcher we started so we can close them later.
var watchers = [];

/**
 *   Runs the initializer. Will output basic files to the current working
 *    directory.
 *   @param {object} options - Options for the initializer.
 *   @param {boolean} [options.onlyConfig=false] - Only create the config file.
 *   @see initializer
 *   @param {function} callback - Function to call once done.
 */
exports.init = function runInitializer(options, callback) {
    var initializer = require('./initializer');
    initializer.init(options, callback);
}

/**
 *   Starts the core application.
 *   @param {object} options - An object containing options.
 *   @param {array} [options.routes=['mock/ftlRoutes.js', 'mock/routes.js']] -
 *    An array of paths to all files containing mocked routes.
 *   @param {boolean} [options.config=false] - Use config file.
 *   @param {string} [options.templates='templates'] - Root folder for FTL
 *    template files.
 *   @param {string} [options.root='./'] - Root folder for static files to
 *    serve.
 *   @param {number} [options.port=8080] - The port to use for the server.
 *   @param {string}
 *    [options.watch='js css html xhtml ftl'] - Filetypes
 *    (seperate them by pipes) to watch for changes.
 *   @param {regEx} [options.exclude=/node_modules/] - Files to exclude from
 *    watching.
 *   @param {boolean} [options.localhost=false] - Use `localhost` instead of
 *    `127.0.0.1`.
 *   @param {boolean} [options.browser=true] - Automatically open a browser for
 *    the user.
 *   @param {boolean} [options.debug=false] - Enable debugging output and log
 *    file.
 *   @param callback {function} Function to call once started.
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
 *   @param {function} callback - Function to call once done.
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
    var combinedFile = 'allPuerFRoutes.js';

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

	//Also watch template files for changed.
	walk(templatesPath, /.ftl$/, function(err, templateFiles) {
		templateFiles.forEach(function(template) {
			var watcher = fs.watch(template, (event, filename) => {
				onRoutesChange();
			});
			watchers.push(watcher);
		})
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
        processor.process(routeFiles, combinedFile, templatesPath, callback);
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

    /*
     *   Handle Ctrl + C
     */
    process.on('SIGINT', function() {
        fs.unlink(combinedFile, function() {
			cleanTemplates(templatesPath, function() {
				logger.info('Now exiting, goodby.');
			});
        });
    });

	/**
	 *   Walks a filestructure starting from a given root and pushes all found
	 *   files onto a given stream. Compares all files against a filter.
	 *   @param  {String}   dir    - Root directory
	 *   @param  {RegEx}    filter - RegEx to test found files against
	 *   @param  {Function} done   - Callback will be called with (err, foundFiles)
	 *   @private
	 */
	 function walk(dir, filter, done) {
 	    var results = [];
 	    fs.readdir(dir, function(err, list) {
 	        if (err) return done(err);
 	        var pending = list.length;
 	        if (!pending) return done(null, results);
 	        list.forEach(function(file) {
 	            file = path.resolve(dir, file);
 	            fs.stat(file, function(err, stat) {
 	                if (stat && stat.isDirectory()) {
 	                    walk(file, filter, function(err, res) {
 	                        results = results.concat(res);
 	                        if (!--pending) done(null, results);
 	                    });
 	                } else {
 						if(filter.test(file)) {
 							results.push(file);
 						}
 	                    if (!--pending) done(null, results);
 	                }
 	            });
 	        });
 	    });
 	};

};
