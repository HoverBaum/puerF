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
var mockRoutes = require('./puerMockRouter');

/**
*   Start a puer server to serve files and watch for changes.
*/
var puerServer = function(routesFile, options) {

    //Better make sure options is defined or below will throw errors.
    if(options === undefined) {
        options = {};
    }

    console.log(options);

    //Set options to either default or provided.
    var port = options.port || 8080;
    var dir = options.dir || './';
    var ignored = options.irgnored || /node_modules/;
    var filetype = options.watch || 'js|css|html|xhtml';

    var app = express();
    var server = http.createServer(app);

    var options = {
        dir,
        ignored,
        filetype
    };
    console.log(options);

    //Use puer as a middleware for the express server.
    app.use(puer.connect(app, server , options));

    //Other middleware.
    var staticDir = (options.dir) ? path.join(__dirname, options.dir) : __dirname
    app.use("/", express.static(staticDir));

    //Create routes for everything in our combined routes file.
    var config = require('./' + routesFile.replace(/\.js$/, ''));
    mockRoutes(config, app);

    server.listen(port, function(){
        console.log(`Listening on port ${port}`)
    });

};
module.exports = puerServer;
