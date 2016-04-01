/**
    puerServer module for puerFreemarker.

    This module provides a single function to start a puer Server.

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

//Include dependencies.
var express = require('express');
var path = require('path');
var puer = require('puer');
var http = require('http');
var open = require('open');
var helper = require('./helper');
var mockRoutes = require('./puerMockRouter');

//Include this here in case this is used as a global package.
var Freemarker = require('freemarker.js');

/**
 *   Start a puer server to serve files and watch for changes.
 */
function startPuerServer(routesFile, options) {

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

    //The root directory for static files.
    var staticDir = (options.dir) ? path.join(process.cwd(), options.dir) : process.cwd();

    //A container for mocked routes.
    var mocks = null;
    setupMockRoutes();

    //Use puer as a middleware for the express server.
    var puerOptions = {
        dir,
        ignored,
        filetype
    };
    app.use(puer.connect(app, server, puerOptions));

    //Some basic logging, later more.
    //IDEA more logging, probably in seperate file for mock paths.
    app.use(function(req, res, next) {
        console.log('Time:', Date.now());
        next();
    });

    //Serve static files.
    app.use("/", express.static(staticDir));

    //Setup freemarker template handling.
    var viewRoot = path.join(process.cwd(), options.templatesPath);
    viewRoot = viewRoot.replace(/\\/g, "\\\\"); //HACK this is an ugly hackaround for windows.
    var fm = new Freemarker({
          viewRoot: viewRoot
    });

    //Create routes for everything in our combined routes file.
    app.use('/*', function(req, res, next) {
        var method = req.method.toLowerCase();
        var url = req.originalUrl;
        var call = mocks[method].get(url);
        if (call !== undefined) {
            call(req, res, next);
        } else {
            next();
        }
    });

    //Actually run the server.
    //TODO check if port available, try different one otherwise.
    var listener = server.listen(port, function() {
        var usedPort = listener.address().port

        //Open browser for user.
        if (options.browser) {
            var domain = (options.localhost) ? 'localhost' : '127.0.0.1';
            open(`http://${domain}:${usedPort}`);
        }
    });

    /**
     *   Will parse the combined routes file into actual routes.
     */
    function setupMockRoutes() {
        var requirePath = path.join(staticDir, routesFile.replace(/\.js$/, ''));
        var config = helper.loadModule(requirePath);
        mocks = mockRoutes(config);
    }

    return {
        updateRoutes: setupMockRoutes
    }

};
module.exports = startPuerServer;
