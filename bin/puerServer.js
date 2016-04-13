/**
    puerServer module for puerFreemarker.

    This module provides a single function to start a puer Server.

    routesFile: relativ path to combined file, from current working directory.

    You can hand it an options object or use the default options.
    options = {
        port,           Specific port to use
        dir,            Root directory for serving static files
        ignored,        Files to ignore
        filetype,       Filetypes to watch
        localhost,      Wether to use localhost instead of 127.0.0.1
        browser,        If the browser should be opened automatically
        templatesPath   The path where templates can be found
    }

*/

//TODO handle requests to something/:param
//maybe let express get the params for us, cut the url and only register listeners on something.
//conflict with comething/:one/:two
//try using inbuild mocking of puer more and only mock routes for freemarker templates myself, maybe that works better.

//NOTE maybe replace puer with a live-reloader as we are only using it for that, could solve bugs in test with server not closing

//NOTE using express starts to seem like an overhead that is unneded.

//Include dependencies.
var express = require('express');
var path = require('path');
var puer = require('puer');
var http = require('http');
var open = require('open');
var helper = require('./helper');
var mocks = require('./puerMockRouter');
var logger = require('./logger');

//Include this here in case this is used as a global package.
var Freemarker = require('freemarker.js');

/**
 *   Start a puer server to serve files and watch for changes.
 */
function startPuerServer(routesFile, options, callback) {

    //Disable console.log while server is starting, to prevent puer logs.
    var oldConsole = console.log;
    console.log = function() {};
    logger.debug('Starting puer server for routes file: ', routesFile);
    logger.debug('With options: ', options);

    //Better make sure options is defined or below will throw errors.
    if (options === undefined) {
        options = {};
    }

    //Set options to either default or provided.
    var port = options.port || 8080;
    var dir = options.dir || './';
    var ignored = options.ignored || /node_modules/;
    var filetype = options.watch || 'js|css|html|xhtml';

    //Express app and http server.
    var app = express();
    var server = http.createServer(app);

    configureServer();
    setupMockRoutes(startServer);


    /**
     *   Set up the express server and configure routing.
     */
    function configureServer() {

        //The root directory for static files.
        var staticDir = (options.dir) ? helper.absolutePath(options.dir) : process.cwd();
        logger.debug('Static files will be served from: ', staticDir);

        //A container for mocked routes.

        //Use puer as a middleware for the express server.
        var puerOptions = {
            dir,
            ignored,
            filetype
        };
        logger.debug('Options for puer: ', puerOptions);

        /*
            Include middlewares, puer has to be the first one!
        */
        app.use(puer.connect(app, server, puerOptions));
        //NOTE this is keeping the server from shutting down programatically

        //Serve static files.
        app.use("/", express.static(staticDir));

        //Setup freemarker template handling.
        var viewRoot = path.join(process.cwd(), options.templatesPath);
        viewRoot = viewRoot.replace(/\\/g, "\\\\"); //HACK this is an ugly hackaround for windows.
        logger.debug('Freemarker templates folder: ', viewRoot);
        var fm = new Freemarker({
            viewRoot: viewRoot
        });

        //Create routes for everything in our combined routes file.
        app.use('/*', function(req, res, next) {
            var method = req.method.toLowerCase();
            var url = req.originalUrl.replace(/\?.*=.*$/, '');
            logger.silly('Now looking up info object', url);
            var info = mocks.lookUp(url, method);
            console.log(info);
            logger.silly('Looked up info object', info);
            logger.silly('Request to server', {
                time: Date.now(),
                originalUrl: req.originalUrl,
                url,
                method: req.method,
                infoObj: info
            });
            this.fm = fm;
            if (info !== undefined) {
                console.log('info not undefined');
                req.params = info.paramValues;
                var handler = info.call;
                logger.silly('Mocking route ', {
                    url: url,
                    method: method
                });

                //Call handler with this as context so that fm is present.
                handler(req, res, next, fm);
            } else {
                console.log('404');
                res.status(404).end();
            }
        });
    }

    /**
     *   Actually start the server.
     */
    function startServer() {

        //TODO check if port available, try different one otherwise.
        var listener = server.listen(port, function() {
            var usedPort = listener.address().port
            logger.info(`Server running on port: ${usedPort}`);

            //Reanable console.
            console.log = oldConsole;

            //We are now finsihed setting up.
            if (callback) {
                callback(server);
            }

            //Open browser for user.
            if (options.browser) {
                logger.info('Openening browser...');
                var domain = (options.localhost) ? 'localhost' : '127.0.0.1';
                open(`http://${domain}:${usedPort}`);
                logger.info('Happy coding :)');
            }
        });
    }


    /**
     *   Will parse the combined routes file into actual routes.
     */
    function setupMockRoutes(callback) {
        var requirePath = helper.absolutePath(routesFile);
        logger.debug('Getting config for mocked routes', {
            requirePath
        });
        var config = helper.loadModule(requirePath);
        mocks.configure(config);
        logger.debug('Rebuild mocks');
        if (callback) {
            callback();
        }
    }

    /**
     *   Closes the server down.
     */
    function closeServer(callback) {
        logger.debug('Server will be closed');
        server.close(function() {
            logger.debug('Server closed');
            if (callback) {
                callback();
            }
        });
    }

    return {
        updateRoutes: setupMockRoutes,
        close: closeServer
    }

};
module.exports = startPuerServer;
