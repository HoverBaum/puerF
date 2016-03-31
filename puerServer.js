/**
    puerServer module for puerFreemarker.

    This module provides a single function to start a puer Server.
    It will listen to file changes and update the website.

    You can hand it an options object or use the default options.

*/

//Include dependencies.
var express = require("express");
var path = require("path");
var puer = require("puer");
var http = require("http");
var open = require('open');
var mockRoutes = require('./puerMockRouter');

/**
*   Start a puer server to serve files and watch for changes.
*/
var puerServer = function(routesFile, options) {

    //Better make sure options is defined or below will throw errors.
    if(options === undefined) {
        options = {};
    }

    //Set options to either default or provided.
    var port = options.port || 8080;
    var dir = options.dir || './';
    var ignored = options.irgnored || /node_modules/;
    var filetype = options.watch || 'js|css|html|xhtml';

    var app = express();
    var server = http.createServer(app);
    var staticDir = (options.dir) ? path.join(__dirname, options.dir) : __dirname;
    var mocks = null;
    setupMockRoutes();

    var puerOptions = {
        dir,
        ignored,
        filetype
    };

    //Use puer as a middleware for the express server.
    app.use(puer.connect(app, server , puerOptions));

    //Some basic logging, later more.
    //IDEA more logging, probably in seperate file for mock paths.
    app.use(function(req, res, next) {
        console.log('Time:', Date.now());
        next();
    });

    app.use("/", express.static(staticDir));

    //Create routes for everything in our combined routes file.
    app.use('/*', function(req, res, next) {
        var method = req.method.toLowerCase();
        var url = req.originalUrl;
        var call = mocks[method].get(url);
        if(call !== undefined) {
            call(req, res, next);
        } else {
             next();
        }
    });


    var listener = server.listen(port, function(){
        var usedPort = listener.address().port
        console.log(`Serveing files and mocked requests on port ${usedPort}`);

        //Open browser for user.
        if(options.browser) {
            var domain = (options.localhost) ? 'localhost' : '127.0.0.1';
            open(`http://${domain}:${usedPort}`);
        }
    });

    /**
    *   Will parse the combined routes file into actual routes.
    */
    function setupMockRoutes() {
        console.log('setting routes');
        var requirePath = './' + routesFile.replace(/\.js$/, '');
        delete require.cache[require.resolve(requirePath)];
        var config = require(requirePath);
        mocks = mockRoutes(config);
    }

    return {
        updateRoutes: setupMockRoutes
    }

};
module.exports = puerServer;
