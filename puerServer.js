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

/**
*   Start a puer server to serve files and watch for changes.
*/
var puerServer = function(options) {

    //Better make sure options is defined or below will throw errors.
    if(options === undefined) {
        options = {};
    }

    //Set options to either default or provided.
    var port = options.port || 8080;
    var dir = options.dir || './';
    var ignored = options.irgnored || /node_modules/;
    var filetype = options.watch || 'js|css|html|xhtml';
    var rootFolder = options.root || '';

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
    app.use("/", express.static(__dirname));

    server.listen(port, function(){
        console.log(`Listening on port ${port}`)
    });

};
module.exports = puerServer;
